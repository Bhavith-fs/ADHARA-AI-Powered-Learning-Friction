import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './TeacherDashboard.css'

/**
 * Teacher Dashboard - Professional Analysis View
 * Split-panel: Students left, Analysis right
 */

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
const MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'qwen2.5-coder:7b'

// Baseline data from baseline_dataset.json
const BASELINE_DATA = {
    "6-8": { label: "Early Elementary", mouse: { avgHesitationMs: 2500, avgCorrections: 3, avgResponseTime: 180000 } },
    "9-11": { label: "Upper Elementary", mouse: { avgHesitationMs: 1800, avgCorrections: 2, avgResponseTime: 150000 } },
    "12-14": { label: "Middle School", mouse: { avgHesitationMs: 1200, avgCorrections: 1.5, avgResponseTime: 120000 } },
    "15+": { label: "High School+", mouse: { avgHesitationMs: 800, avgCorrections: 1, avgResponseTime: 90000 } }
}

function TeacherDashboard() {
    const navigate = useNavigate()
    const [sessions, setSessions] = useState([])
    const [selectedSession, setSelectedSession] = useState(null)
    const [aiAnalysis, setAiAnalysis] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [ollamaConnected, setOllamaConnected] = useState(false)
    const [autoAnalyze, setAutoAnalyze] = useState(true)

    useEffect(() => {
        if (!localStorage.getItem('adhara_admin')) {
            navigate('/admin-login')
            return
        }
        loadSessions()
        checkOllama()
    }, [navigate])

    useEffect(() => {
        if (selectedSession && autoAnalyze && ollamaConnected && !aiAnalysis) {
            analyzeWithAI()
        }
    }, [selectedSession, autoAnalyze, ollamaConnected])

    const loadSessions = () => {
        const sessions = []
        const current = localStorage.getItem('adhara_session_complete')
        if (current) {
            try {
                const parsed = JSON.parse(current)
                if (parsed?.completedAt) sessions.push(parsed)
            } catch (e) { }
        }
        const history = localStorage.getItem('adhara_sessions_history')
        if (history) {
            try {
                const parsed = JSON.parse(history)
                if (Array.isArray(parsed)) {
                    parsed.forEach(s => {
                        if (s.completedAt && !sessions.find(ex => ex.completedAt === s.completedAt)) {
                            sessions.push(s)
                        }
                    })
                }
            } catch (e) { }
        }
        sessions.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        setSessions(sessions)
        if (sessions.length > 0) setSelectedSession(sessions[0])
    }

    const checkOllama = async () => {
        try {
            const res = await fetch(`${OLLAMA_URL}/api/tags`)
            setOllamaConnected(res.ok)
        } catch { setOllamaConnected(false) }
    }

    const handleSelectSession = (session) => {
        setSelectedSession(session)
        setAiAnalysis('')
    }

    // Get age group from child age
    const getAgeGroup = (age) => {
        if (age <= 8) return "6-8"
        if (age <= 11) return "9-11"
        if (age <= 14) return "12-14"
        return "15+"
    }

    // Calculate deviations from baseline
    const calculateDeviations = () => {
        if (!selectedSession) return null
        const age = selectedSession.childData?.age || 10
        const ageGroup = getAgeGroup(age)
        const baseline = BASELINE_DATA[ageGroup]
        const summary = selectedSession.summary || {}

        const avgResponseTime = summary.avgResponseTime || 0
        const corrections = summary.totalCorrections || selectedSession.corrections || 0
        const hesitations = summary.hesitationCount || selectedSession.hesitationEvents?.length || 0

        return {
            ageGroup,
            baseline,
            responseTimeDeviation: baseline.mouse.avgResponseTime > 0
                ? ((avgResponseTime - baseline.mouse.avgResponseTime) / baseline.mouse.avgResponseTime * 100).toFixed(0)
                : 0,
            correctionsDeviation: baseline.mouse.avgCorrections > 0
                ? ((corrections - baseline.mouse.avgCorrections) / baseline.mouse.avgCorrections * 100).toFixed(0)
                : 0,
            hesitationDeviation: baseline.mouse.avgHesitationMs > 0
                ? ((hesitations * 1000 - baseline.mouse.avgHesitationMs) / baseline.mouse.avgHesitationMs * 100).toFixed(0)
                : 0
        }
    }

    // Get friction level from deviations
    const getFrictionLevel = () => {
        const deviations = calculateDeviations()
        if (!deviations) return { level: 'Unknown', color: '#888', score: 0 }

        const avgDeviation = (
            Math.abs(parseFloat(deviations.responseTimeDeviation)) +
            Math.abs(parseFloat(deviations.correctionsDeviation)) +
            Math.abs(parseFloat(deviations.hesitationDeviation))
        ) / 3

        if (avgDeviation > 70) return { level: 'High', color: '#e53935', score: avgDeviation }
        if (avgDeviation > 30) return { level: 'Medium', color: '#fb8c00', score: avgDeviation }
        return { level: 'Low', color: '#43a047', score: avgDeviation }
    }

    // Calculate strengths and concerns
    const analyzeStrengthsAndConcerns = () => {
        if (!selectedSession) return { strengths: [], concerns: [] }

        const summary = selectedSession.summary || {}
        const responses = selectedSession.responses || []
        const deviations = calculateDeviations()

        const strengths = []
        const concerns = []

        const correctRate = responses.length > 0
            ? (responses.filter(r => r.correct).length / responses.length * 100).toFixed(0)
            : 0

        // Analyze performance
        if (correctRate >= 80) strengths.push(`Strong accuracy: ${correctRate}% correct on first try`)
        else if (correctRate < 50) concerns.push(`Low accuracy: Only ${correctRate}% correct on first try`)

        if (parseFloat(deviations?.responseTimeDeviation) < 0)
            strengths.push("Faster than expected for age group")
        else if (parseFloat(deviations?.responseTimeDeviation) > 50)
            concerns.push("Response time significantly slower than baseline")

        if ((summary.totalCorrections || 0) === 0)
            strengths.push("No re-attempts needed - confident responses")
        else if ((summary.totalCorrections || 0) > 3)
            concerns.push(`Multiple re-attempts (${summary.totalCorrections}) may indicate uncertainty`)

        if ((summary.hesitationCount || 0) === 0)
            strengths.push("Consistent engagement without hesitation")
        else if ((summary.hesitationCount || 0) > 3)
            concerns.push(`Frequent hesitations (${summary.hesitationCount}) observed`)

        if ((summary.stressIndicatorCount || 0) === 0)
            strengths.push("No stress indicators detected")
        else if ((summary.stressIndicatorCount || 0) > 2)
            concerns.push("Stress patterns detected during activities")

        if ((summary.voiceDataPoints || 0) > 0)
            strengths.push(`Completed ${summary.voiceDataPoints} verbal activities`)

        return { strengths, concerns }
    }

    const analyzeWithAI = async () => {
        if (!selectedSession || !ollamaConnected) return

        setIsAnalyzing(true)
        setAiAnalysis('')

        const child = selectedSession.childData || {}
        const responses = selectedSession.responses || []
        const summary = selectedSession.summary || {}
        const deviations = calculateDeviations()
        const friction = getFrictionLevel()
        const { strengths, concerns } = analyzeStrengthsAndConcerns()

        const speechAnalysis = summary.speechAnalysis || {}
        const faceAnalysis = summary.faceAnalysis || {}
        const baseline = deviations?.baseline || { label: 'Standard', mouse: { avgHesitationMs: 1800, avgCorrections: 2 } }

        // NEW: Get disorder detection results
        const disorderDetection = summary.disorderDetection || {}
        const screeningPriority = summary.screeningPriority || { priority: 'LOW', reason: 'Not analyzed' }

        // Format disorder detection for prompt
        const formatDetectionResults = () => {
            const results = []
            Object.entries(disorderDetection).forEach(([key, data]) => {
                if (data.dataAvailable) {
                    results.push(`- ${data.icon} ${data.name}: ${data.overallStatus} (${data.overallScore}% concern)`)
                    if (data.overallStatus !== 'TYPICAL') {
                        Object.entries(data.indicators || {}).forEach(([ind, indData]) => {
                            if (indData.status !== 'TYPICAL') {
                                results.push(`  • ${indData.label}: ${indData.observed} (expected ${indData.expected}, ${indData.deviation > 0 ? '+' : ''}${indData.deviation}%)`)
                            }
                        })
                    }
                }
            })
            return results.length > 0 ? results.join('\n') : 'No domain-specific analysis available'
        }

        const prompt = `You are ADHARA, an AI system for EARLY DETECTION of learning difficulties. Generate a clinical-grade screening report.

CRITICAL RULES:
- You ARE allowed to mention potential early indicators of: dyslexia patterns, dyscalculia patterns, attention regulation patterns, auditory processing patterns, visual processing patterns
- Use terms like: "early indicators consistent with...", "patterns that may suggest...", "warrants further screening for..."
- Still emphasize this is SCREENING not DIAGNOSIS
- Be specific and clinical in your analysis
- End recommendations with "Professional evaluation recommended"

---
## STUDENT PROFILE
- **Name:** ${child.name || 'Student'}
- **Age:** ${child.age || 'Unknown'} years
- **Baseline Group:** ${baseline?.label || 'Standard'}

## SCREENING PRIORITY: ${screeningPriority.priority}
**Reason:** ${screeningPriority.reason}
${screeningPriority.areas?.length > 0 ? `**Concern Areas:** ${screeningPriority.areas.join(', ')}` : ''}

## DOMAIN-SPECIFIC DETECTION RESULTS
${formatDetectionResults()}

## SESSION BEHAVIORAL DATA
- **Motor Patterns:** ${summary.totalMouseMovements || 0} movements, ${summary.hesitationCount || 0} hesitations
- **Speech Analysis:** ${speechAnalysis.totalWordsSpoken || 0} words, ${speechAnalysis.fillerWordCount || 0} fillers, ${speechAnalysis.stammerCount || 0} speech repetitions
- **Emotional Markers:** ${faceAnalysis.dominantEmotion || 'neutral'} (${((faceAnalysis.stressRatio || 0) * 100).toFixed(0)}% stress indicators)
- **Task Performance:** ${responses.filter(r => r.correct).length}/${responses.length} correct (${Math.round((responses.filter(r => r.correct).length / Math.max(responses.length, 1)) * 100)}% accuracy)
- **Response Speed:** ${summary.avgResponseTime || 0}ms average (baseline: ${baseline?.mouse?.avgHesitationMs || 1800}ms)

---

Generate a CLINICAL SCREENING REPORT with these EXACT sections:

# 🔬 ADHARA Early Detection Screening Report

## Executive Summary
[State the overall concern level and most significant finding. Be direct about which learning patterns were detected.]

## 🎯 Screening Results by Domain

### 📖 Phonological Processing (Dyslexia Indicators)
- **Status:** [TYPICAL / WATCH / SCREEN]
- **Key Finding:** [Specific pattern observed or "Within normal range"]
- **Clinical Indicator:** [If WATCH/SCREEN: "Early indicators consistent with phonological processing differences" or similar]

### 🔢 Numerical Cognition (Dyscalculia Indicators)  
- **Status:** [TYPICAL / WATCH / SCREEN]
- **Key Finding:** [Specific pattern observed or "Within normal range"]
- **Clinical Indicator:** [If WATCH/SCREEN: "Patterns suggest numerical processing may warrant evaluation"]

### 🧠 Executive Function (Attention Indicators)
- **Status:** [TYPICAL / WATCH / SCREEN]
- **Key Finding:** [Gaze stability, impulse control, task switching analysis]
- **Clinical Indicator:** [If elevated: "Attention regulation patterns warrant further screening"]

### 👂 Auditory Processing
- **Status:** [TYPICAL / WATCH / SCREEN]
- **Key Finding:** [Speech fluency, verbal hesitation analysis]
- **Clinical Indicator:** [Based on filler words, stammers, verbal response patterns]

### 👁️ Visual Processing
- **Status:** [TYPICAL / WATCH / SCREEN]
- **Key Finding:** [Pattern recognition, shape matching analysis]
- **Clinical Indicator:** [Based on visual task performance]

## ⚠️ Early Intervention Recommendations
${screeningPriority.priority === 'HIGH' ? '**PRIORITY ACTION REQUIRED:**' : ''}
1. [Most important specific action based on highest concern area]
2. [Second specific recommendation]
3. [Monitoring/follow-up recommendation]

## 📋 Recommended Professional Screenings
[List specific formal assessments recommended based on elevated areas, e.g., "Comprehensive phonological awareness assessment", "Attention and executive function evaluation"]

---
⚠️ **SCREENING NOTICE:** This report identifies behavioral patterns for early intervention purposes. Elevated indicators suggest areas for professional evaluation - they are NOT diagnoses. All findings require validation by qualified educational psychologists or learning specialists.

*Professional evaluation recommended for all elevated domains.*`


        try {
            const res = await fetch(`${OLLAMA_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: MODEL,
                    prompt,
                    stream: false,
                    options: { temperature: 0.2, num_predict: 1500 }
                })
            })
            if (res.ok) {
                const data = await res.json()
                setAiAnalysis(data.response || 'Analysis unavailable')
            } else {
                setAiAnalysis('Error generating analysis')
            }
        } catch (err) {
            setAiAnalysis(`Error: ${err.message}`)
        } finally {
            setIsAnalyzing(false)
        }
    }

    const deviations = calculateDeviations()
    const friction = getFrictionLevel()
    const { strengths, concerns } = analyzeStrengthsAndConcerns()

    return (
        <div className="teacher-dashboard-v2">
            {/* Header */}
            <header className="dash-header">
                <div className="header-brand">
                    <span className="brand-icon">📊</span>
                    <h1>ADHARA Analysis</h1>
                    <span className={`status-dot ${ollamaConnected ? 'online' : 'offline'}`} />
                </div>
                <div className="header-controls">
                    <label className="toggle-auto">
                        <input type="checkbox" checked={autoAnalyze} onChange={e => setAutoAnalyze(e.target.checked)} />
                        <span>Auto-analyze</span>
                    </label>
                    <button onClick={loadSessions} className="btn-refresh">⟳ Refresh</button>
                    <button onClick={() => { localStorage.removeItem('adhara_admin'); navigate('/play') }} className="btn-logout">Logout</button>
                </div>
            </header>

            <div className="dash-layout">
                {/* Left Sidebar - Student List */}
                <aside className="student-sidebar">
                    <h2>Students ({sessions.length})</h2>
                    <div className="student-list">
                        {sessions.map((s, i) => {
                            const corr = s.summary?.totalCorrections || s.corrections || 0
                            const resp = s.responses?.length || 0
                            const correct = s.responses?.filter(r => r.correct).length || 0
                            return (
                                <button
                                    key={i}
                                    className={`student-card ${selectedSession === s ? 'active' : ''}`}
                                    onClick={() => handleSelectSession(s)}
                                >
                                    <div className="student-avatar">{s.childData?.name?.[0] || '?'}</div>
                                    <div className="student-info">
                                        <span className="student-name">{s.childData?.name || 'Unknown'}</span>
                                        <span className="student-meta">Age {s.childData?.age} • {new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="student-score">
                                        <span className={`score-badge ${correct / resp >= 0.8 ? 'good' : correct / resp >= 0.5 ? 'ok' : 'low'}`}>
                                            {resp > 0 ? Math.round(correct / resp * 100) : 0}%
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                        {sessions.length === 0 && (
                            <div className="no-students">
                                <p>No sessions yet</p>
                                <a href="/play">Start a session →</a>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Panel - Analysis */}
                <main className="analysis-panel">
                    {selectedSession ? (
                        <>
                            {/* Quick Stats Bar */}
                            <div className="quick-stats">
                                <div className="stat">
                                    <span className="stat-value">{selectedSession.childData?.name}</span>
                                    <span className="stat-label">Student</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{selectedSession.childData?.age}</span>
                                    <span className="stat-label">Age</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{Math.round((selectedSession.totalDurationMs || 0) / 1000)}s</span>
                                    <span className="stat-label">Duration</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value" style={{ color: friction.color }}>{friction.level}</span>
                                    <span className="stat-label">Friction</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{deviations?.ageGroup}</span>
                                    <span className="stat-label">Baseline</span>
                                </div>
                            </div>

                            {/* Pros & Cons */}
                            <div className="pros-cons-grid">
                                <div className="pros-card">
                                    <h3>✅ Strengths</h3>
                                    <ul>
                                        {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li className="empty">No notable strengths identified</li>}
                                    </ul>
                                </div>
                                <div className="cons-card">
                                    <h3>⚠️ Areas for Support</h3>
                                    <ul>
                                        {concerns.length > 0 ? concerns.map((c, i) => <li key={i}>{c}</li>) : <li className="empty">No concerns identified</li>}
                                    </ul>
                                </div>
                            </div>

                            {/* AI Analysis */}
                            <div className="analysis-card">
                                <div className="analysis-header">
                                    <h3>📋 Analysis Report</h3>
                                    <button onClick={analyzeWithAI} disabled={isAnalyzing || !ollamaConnected} className="btn-analyze">
                                        {isAnalyzing ? '⏳ Analyzing...' : '🔄 Regenerate'}
                                    </button>
                                </div>
                                <div className="analysis-content">
                                    {isAnalyzing ? (
                                        <div className="loading">Generating structured analysis...</div>
                                    ) : aiAnalysis ? (
                                        <div className="markdown-output">
                                            <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="placeholder">{ollamaConnected ? 'Click to generate analysis' : 'AI offline - run: OLLAMA_ORIGINS="*" ollama serve'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Captured Data */}
                            <div className="captured-data">
                                <h3>📊 Captured Signals</h3>
                                <div className="signals-grid">
                                    <div className="signal">
                                        <span className="signal-icon">🖱️</span>
                                        <span className="signal-value">{selectedSession.summary?.totalMouseMovements || selectedSession.mouseMovements || 0}</span>
                                        <span className="signal-label">Mouse Movements</span>
                                    </div>
                                    <div className="signal">
                                        <span className="signal-icon">⏸️</span>
                                        <span className="signal-value">{selectedSession.summary?.hesitationCount || selectedSession.hesitationEvents?.length || 0}</span>
                                        <span className="signal-label">Hesitations</span>
                                    </div>
                                    <div className="signal">
                                        <span className="signal-icon">🔄</span>
                                        <span className="signal-value">{selectedSession.summary?.totalCorrections || selectedSession.corrections || 0}</span>
                                        <span className="signal-label">Re-attempts</span>
                                    </div>
                                    <div className="signal">
                                        <span className="signal-icon">🎤</span>
                                        <span className="signal-value">{selectedSession.summary?.voiceDataPoints || selectedSession.voiceData?.length || 0}</span>
                                        <span className="signal-label">Voice Samples</span>
                                    </div>
                                    <div className="signal">
                                        <span className="signal-icon">📹</span>
                                        <span className="signal-value">{selectedSession.summary?.faceDataPoints || selectedSession.faceData?.length || 0}</span>
                                        <span className="signal-label">Face Samples</span>
                                    </div>
                                    <div className="signal">
                                        <span className="signal-icon">⚡</span>
                                        <span className="signal-value">{selectedSession.summary?.stressIndicatorCount || selectedSession.stressIndicators?.length || 0}</span>
                                        <span className="signal-label">Stress Signs</span>
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="activity-timeline">
                                    <h4>Response Timeline</h4>
                                    <div className="timeline">
                                        {selectedSession.responses?.map((r, i) => (
                                            <div key={i} className={`timeline-item ${r.correct === true ? 'correct' : r.correct === false ? 'wrong' : 'verbal'}`}>
                                                <span className="timeline-type">{r.type}</span>
                                                <span className="timeline-indicator">{r.correct === true ? '✓' : r.correct === false ? '✗' : '🎤'}</span>
                                                <span className="timeline-time">{r.responseTimeMs ? `${(r.responseTimeMs / 1000).toFixed(1)}s` : '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Speech Analysis Section */}
                                {selectedSession.summary?.speechAnalysis && (
                                    <div className="speech-analysis-card">
                                        <h4>🎤 Speech Analysis</h4>
                                        <div className="speech-metrics">
                                            <div className="speech-metric">
                                                <span className="metric-value">{selectedSession.summary.speechAnalysis.totalWordsSpoken || 0}</span>
                                                <span className="metric-label">Words Spoken</span>
                                            </div>
                                            <div className="speech-metric">
                                                <span className="metric-value">{selectedSession.summary.speechAnalysis.speechRateWPM || 0}</span>
                                                <span className="metric-label">WPM</span>
                                            </div>
                                            <div className="speech-metric">
                                                <span className="metric-value" style={{ color: (selectedSession.summary.speechAnalysis.fillerWordCount || 0) > 3 ? '#f57c00' : '#333' }}>
                                                    {selectedSession.summary.speechAnalysis.fillerWordCount || 0}
                                                </span>
                                                <span className="metric-label">Fillers (um, uh)</span>
                                            </div>
                                            <div className="speech-metric">
                                                <span className="metric-value" style={{ color: (selectedSession.summary.speechAnalysis.stammerCount || 0) > 2 ? '#e53935' : '#333' }}>
                                                    {selectedSession.summary.speechAnalysis.stammerCount || 0}
                                                </span>
                                                <span className="metric-label">Stammers</span>
                                            </div>
                                            <div className="speech-metric">
                                                <span className="metric-value">{selectedSession.summary.speechAnalysis.avgPauseDurationMs || 0}ms</span>
                                                <span className="metric-label">Avg Pause</span>
                                            </div>
                                            <div className="speech-metric">
                                                <span className="metric-value">{selectedSession.summary.speechAnalysis.selfCorrections || 0}</span>
                                                <span className="metric-label">Self-Corrections</span>
                                            </div>
                                        </div>
                                        {selectedSession.summary.speechAnalysis.continuousTranscript && (
                                            <div className="speech-transcript">
                                                <strong>Transcript:</strong>
                                                <p>"{selectedSession.summary.speechAnalysis.continuousTranscript.substring(0, 200)}..."</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Face Analysis Section */}
                                {selectedSession.summary?.faceAnalysis && (
                                    <div className="face-analysis-card">
                                        <h4>😊 Face/Emotion Analysis</h4>
                                        <div className="face-metrics">
                                            <div className="face-metric">
                                                <span className="metric-value">{selectedSession.summary.faceAnalysis.dominantEmotion || 'unknown'}</span>
                                                <span className="metric-label">Dominant Emotion</span>
                                            </div>
                                            <div className="face-metric">
                                                <span className="metric-value">{selectedSession.summary.faceAnalysis.blinkRatePerMin || 0}</span>
                                                <span className="metric-label">Blinks/min</span>
                                            </div>
                                            <div className="face-metric">
                                                <span className="metric-value">{selectedSession.summary.faceAnalysis.facePresencePercent || 0}%</span>
                                                <span className="metric-label">Face Visible</span>
                                            </div>
                                            <div className="face-metric">
                                                <span className="metric-value" style={{ color: (selectedSession.summary.faceAnalysis.gazeOnScreenPercent || 0) < 60 ? '#f57c00' : '#43a047' }}>
                                                    {selectedSession.summary.faceAnalysis.gazeOnScreenPercent || 0}%
                                                </span>
                                                <span className="metric-label">Gaze On Screen</span>
                                            </div>
                                            <div className="face-metric">
                                                <span className="metric-value" style={{ color: (selectedSession.summary.faceAnalysis.stressRatio || 0) > 0.3 ? '#e53935' : '#333' }}>
                                                    {((selectedSession.summary.faceAnalysis.stressRatio || 0) * 100).toFixed(0)}%
                                                </span>
                                                <span className="metric-label">Stress Ratio</span>
                                            </div>
                                        </div>
                                        {selectedSession.summary.faceAnalysis.emotionDistribution && Object.keys(selectedSession.summary.faceAnalysis.emotionDistribution).length > 0 && (
                                            <div className="emotion-distribution">
                                                <strong>Emotion Distribution:</strong>
                                                <div className="emotion-bars">
                                                    {Object.entries(selectedSession.summary.faceAnalysis.emotionDistribution || {}).map(([emotion, percent]) => (
                                                        <div key={emotion} className="emotion-bar">
                                                            <span className="emotion-name">{emotion}</span>
                                                            <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                                                            <span className="emotion-percent">{percent}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* NEW: Screening Results Card */}
                                {selectedSession.summary?.disorderDetection && (
                                    <div className="screening-results-card">
                                        <h4>🔬 Early Detection Screening Results</h4>
                                        <div className="screening-priority" style={{
                                            background: selectedSession.summary.screeningPriority?.priority === 'HIGH' ? '#ffebee' :
                                                selectedSession.summary.screeningPriority?.priority === 'MEDIUM' ? '#fff3e0' : '#e8f5e9',
                                            borderLeft: `4px solid ${selectedSession.summary.screeningPriority?.priority === 'HIGH' ? '#e53935' :
                                                    selectedSession.summary.screeningPriority?.priority === 'MEDIUM' ? '#f57c00' : '#43a047'
                                                }`
                                        }}>
                                            <span className="priority-badge" style={{
                                                background: selectedSession.summary.screeningPriority?.priority === 'HIGH' ? '#e53935' :
                                                    selectedSession.summary.screeningPriority?.priority === 'MEDIUM' ? '#f57c00' : '#43a047'
                                            }}>
                                                {selectedSession.summary.screeningPriority?.priority || 'LOW'}
                                            </span>
                                            <span className="priority-reason">{selectedSession.summary.screeningPriority?.reason || 'Analysis pending'}</span>
                                        </div>
                                        <div className="domain-results">
                                            {Object.entries(selectedSession.summary.disorderDetection || {}).map(([key, domain]) => (
                                                domain.dataAvailable && (
                                                    <div key={key} className="domain-item">
                                                        <div className="domain-header">
                                                            <span className="domain-icon">{domain.icon}</span>
                                                            <span className="domain-name">{domain.name}</span>
                                                            <span className={`domain-status status-${domain.overallStatus?.toLowerCase()}`}>
                                                                {domain.overallStatus}
                                                            </span>
                                                        </div>
                                                        {domain.overallStatus !== 'TYPICAL' && domain.elevatedCount > 0 && (
                                                            <div className="domain-details">
                                                                <small>{domain.elevatedCount} indicator(s) elevated</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                        {selectedSession.summary.screeningPriority?.areas?.length > 0 && (
                                            <div className="concern-areas">
                                                <strong>Concern Areas:</strong> {selectedSession.summary.screeningPriority.areas.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <h2>📋 Select a Student</h2>
                            <p>Choose a student from the left panel to view their analysis</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default TeacherDashboard
