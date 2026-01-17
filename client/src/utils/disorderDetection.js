/**
 * Disorder Detection Engine
 * 
 * Analyzes behavioral patterns to identify potential early indicators
 * of learning difficulties. Uses weighted scoring against age-normed baselines.
 * 
 * IMPORTANT: This is a SCREENING tool, not diagnostic.
 * All elevated results require professional evaluation.
 */

// Detection signatures - behavioral patterns associated with each area
export const DETECTION_SIGNATURES = {
    dyslexia: {
        name: 'Dyslexia Indicators',
        icon: '📖',
        description: 'Phonological processing and reading patterns',
        indicators: {
            letterReversal: { weight: 0.25, label: 'Letter Confusion (b/d/p/q)' },
            readingHesitation: { weight: 0.20, label: 'Reading Hesitation' },
            phonemeErrors: { weight: 0.20, label: 'Sound-Letter Mapping' },
            rhymingDifficulty: { weight: 0.15, label: 'Rhyming Patterns' },
            wordRecall: { weight: 0.20, label: 'Word Retrieval Speed' }
        },
        screeningRecommendation: 'Comprehensive phonological awareness assessment'
    },
    dyscalculia: {
        name: 'Dyscalculia Indicators',
        icon: '🔢',
        description: 'Numerical cognition and math processing',
        indicators: {
            numberSequencing: { weight: 0.25, label: 'Number Sequencing' },
            quantityEstimation: { weight: 0.20, label: 'Quantity Estimation' },
            mathFactRecall: { weight: 0.25, label: 'Math Fact Recall' },
            countingErrors: { weight: 0.15, label: 'Counting Accuracy' },
            spatialMath: { weight: 0.15, label: 'Spatial-Numerical Reasoning' }
        },
        screeningRecommendation: 'Mathematical cognition assessment'
    },
    adhd: {
        name: 'Attention/Focus Indicators',
        icon: '🧠',
        description: 'Executive function and attention regulation',
        indicators: {
            sustainedAttention: { weight: 0.25, label: 'Sustained Attention' },
            impulseControl: { weight: 0.25, label: 'Impulse Control' },
            gazeStability: { weight: 0.20, label: 'Visual Attention' },
            taskSwitching: { weight: 0.15, label: 'Task Transition' },
            motorRestlessness: { weight: 0.15, label: 'Motor Activity Patterns' }
        },
        screeningRecommendation: 'Attention and executive function evaluation'
    },
    auditoryProcessing: {
        name: 'Auditory Processing Indicators',
        icon: '👂',
        description: 'Speech perception and verbal processing',
        indicators: {
            speechFluency: { weight: 0.25, label: 'Speech Fluency' },
            verbalInstructions: { weight: 0.25, label: 'Verbal Instruction Following' },
            auditoryMemory: { weight: 0.20, label: 'Auditory Memory' },
            soundDiscrimination: { weight: 0.15, label: 'Sound Discrimination' },
            fillerUsage: { weight: 0.15, label: 'Verbal Hesitation Patterns' }
        },
        screeningRecommendation: 'Auditory processing evaluation'
    },
    visualProcessing: {
        name: 'Visual Processing Indicators',
        icon: '👁️',
        description: 'Visual perception and pattern recognition',
        indicators: {
            patternRecognition: { weight: 0.30, label: 'Pattern Recognition' },
            shapeMatching: { weight: 0.25, label: 'Shape Matching' },
            visualMemory: { weight: 0.25, label: 'Visual Memory' },
            spatialOrientation: { weight: 0.20, label: 'Spatial Orientation' }
        },
        screeningRecommendation: 'Visual-perceptual assessment'
    }
}

// Age-normed baselines for each indicator
export const AGE_BASELINES = {
    '6-8': {
        letterReversal: { expected: 1, tolerance: 1 },
        readingHesitation: { expected: 2500, tolerance: 800 },
        phonemeErrors: { expected: 2, tolerance: 1 },
        rhymingDifficulty: { expected: 0.7, tolerance: 0.15 },
        wordRecall: { expected: 3000, tolerance: 1000 },
        numberSequencing: { expected: 0.8, tolerance: 0.15 },
        quantityEstimation: { expected: 2, tolerance: 1 },
        mathFactRecall: { expected: 4000, tolerance: 1500 },
        countingErrors: { expected: 1, tolerance: 1 },
        spatialMath: { expected: 0.7, tolerance: 0.15 },
        sustainedAttention: { expected: 0.6, tolerance: 0.15 },
        impulseControl: { expected: 2, tolerance: 1 },
        gazeStability: { expected: 0.6, tolerance: 0.15 },
        taskSwitching: { expected: 3000, tolerance: 1000 },
        motorRestlessness: { expected: 50, tolerance: 20 },
        speechFluency: { expected: 100, tolerance: 30 },
        verbalInstructions: { expected: 0.7, tolerance: 0.15 },
        auditoryMemory: { expected: 3, tolerance: 1 },
        soundDiscrimination: { expected: 0.7, tolerance: 0.15 },
        fillerUsage: { expected: 5, tolerance: 3 },
        patternRecognition: { expected: 0.7, tolerance: 0.15 },
        shapeMatching: { expected: 0.8, tolerance: 0.15 },
        visualMemory: { expected: 3, tolerance: 1 },
        spatialOrientation: { expected: 0.7, tolerance: 0.15 }
    },
    '9-11': {
        letterReversal: { expected: 0, tolerance: 1 },
        readingHesitation: { expected: 1800, tolerance: 600 },
        phonemeErrors: { expected: 1, tolerance: 1 },
        rhymingDifficulty: { expected: 0.85, tolerance: 0.1 },
        wordRecall: { expected: 2000, tolerance: 800 },
        numberSequencing: { expected: 0.9, tolerance: 0.1 },
        quantityEstimation: { expected: 1, tolerance: 1 },
        mathFactRecall: { expected: 3000, tolerance: 1000 },
        countingErrors: { expected: 0, tolerance: 1 },
        spatialMath: { expected: 0.8, tolerance: 0.1 },
        sustainedAttention: { expected: 0.7, tolerance: 0.1 },
        impulseControl: { expected: 1, tolerance: 1 },
        gazeStability: { expected: 0.7, tolerance: 0.1 },
        taskSwitching: { expected: 2000, tolerance: 800 },
        motorRestlessness: { expected: 30, tolerance: 15 },
        speechFluency: { expected: 120, tolerance: 25 },
        verbalInstructions: { expected: 0.8, tolerance: 0.1 },
        auditoryMemory: { expected: 4, tolerance: 1 },
        soundDiscrimination: { expected: 0.8, tolerance: 0.1 },
        fillerUsage: { expected: 3, tolerance: 2 },
        patternRecognition: { expected: 0.8, tolerance: 0.1 },
        shapeMatching: { expected: 0.9, tolerance: 0.1 },
        visualMemory: { expected: 4, tolerance: 1 },
        spatialOrientation: { expected: 0.8, tolerance: 0.1 }
    },
    '12+': {
        letterReversal: { expected: 0, tolerance: 0 },
        readingHesitation: { expected: 1200, tolerance: 400 },
        phonemeErrors: { expected: 0, tolerance: 1 },
        rhymingDifficulty: { expected: 0.95, tolerance: 0.05 },
        wordRecall: { expected: 1500, tolerance: 500 },
        numberSequencing: { expected: 0.95, tolerance: 0.05 },
        quantityEstimation: { expected: 0, tolerance: 1 },
        mathFactRecall: { expected: 2000, tolerance: 800 },
        countingErrors: { expected: 0, tolerance: 0 },
        spatialMath: { expected: 0.9, tolerance: 0.1 },
        sustainedAttention: { expected: 0.8, tolerance: 0.1 },
        impulseControl: { expected: 0, tolerance: 1 },
        gazeStability: { expected: 0.8, tolerance: 0.1 },
        taskSwitching: { expected: 1500, tolerance: 500 },
        motorRestlessness: { expected: 20, tolerance: 10 },
        speechFluency: { expected: 140, tolerance: 20 },
        verbalInstructions: { expected: 0.9, tolerance: 0.1 },
        auditoryMemory: { expected: 5, tolerance: 1 },
        soundDiscrimination: { expected: 0.9, tolerance: 0.1 },
        fillerUsage: { expected: 2, tolerance: 1 },
        patternRecognition: { expected: 0.9, tolerance: 0.1 },
        shapeMatching: { expected: 0.95, tolerance: 0.05 },
        visualMemory: { expected: 5, tolerance: 1 },
        spatialOrientation: { expected: 0.9, tolerance: 0.1 }
    }
}

/**
 * Get age group key from numeric age
 */
export function getAgeGroup(age) {
    const numAge = parseInt(age)
    if (numAge >= 6 && numAge <= 8) return '6-8'
    if (numAge >= 9 && numAge <= 11) return '9-11'
    return '12+'
}

/**
 * Calculate deviation from baseline
 * Returns: { value, deviation, status }
 */
export function calculateDeviation(observed, baseline, isHigherBetter = false) {
    const { expected, tolerance } = baseline
    const deviation = isHigherBetter
        ? ((expected - observed) / expected) * 100
        : ((observed - expected) / expected) * 100

    const absDeviation = Math.abs(deviation)

    let status = 'TYPICAL'
    if (absDeviation > tolerance * 100 * 0.5) status = 'WATCH'
    if (absDeviation > tolerance * 100) status = 'SCREEN'

    return {
        observed,
        expected,
        deviation: Math.round(deviation),
        status
    }
}

/**
 * Analyze session data for disorder indicators
 */
export function analyzeSession(sessionData, childAge) {
    const ageGroup = getAgeGroup(childAge)
    const baselines = AGE_BASELINES[ageGroup]
    const results = {}

    // Extract metrics from session data
    const metrics = extractMetrics(sessionData)

    // Analyze each disorder category
    Object.entries(DETECTION_SIGNATURES).forEach(([key, signature]) => {
        const indicatorResults = {}
        let totalScore = 0
        let totalWeight = 0
        let elevatedCount = 0

        Object.entries(signature.indicators).forEach(([indicator, config]) => {
            if (metrics[indicator] !== undefined && baselines[indicator]) {
                const isHigherBetter = ['sustainedAttention', 'gazeStability', 'speechFluency',
                    'patternRecognition', 'shapeMatching', 'rhymingDifficulty',
                    'numberSequencing', 'verbalInstructions', 'auditoryMemory',
                    'soundDiscrimination', 'visualMemory', 'spatialOrientation', 'spatialMath'].includes(indicator)

                const result = calculateDeviation(metrics[indicator], baselines[indicator], isHigherBetter)
                indicatorResults[indicator] = {
                    ...result,
                    label: config.label,
                    weight: config.weight
                }

                // Calculate weighted score
                const score = result.status === 'SCREEN' ? 1 : result.status === 'WATCH' ? 0.5 : 0
                totalScore += score * config.weight
                totalWeight += config.weight

                if (result.status !== 'TYPICAL') elevatedCount++
            }
        })

        const overallScore = totalWeight > 0 ? (totalScore / totalWeight) : 0
        let overallStatus = 'TYPICAL'
        if (overallScore > 0.3) overallStatus = 'WATCH'
        if (overallScore > 0.6) overallStatus = 'SCREEN'

        results[key] = {
            ...signature,
            indicators: indicatorResults,
            overallScore: Math.round(overallScore * 100),
            overallStatus,
            elevatedCount,
            dataAvailable: Object.keys(indicatorResults).length > 0
        }
    })

    return results
}

/**
 * Extract metrics from session data
 */
function extractMetrics(session) {
    const summary = session.summary || {}
    const responses = session.responses || []
    const speechAnalysis = summary.speechAnalysis || {}
    const faceAnalysis = summary.faceAnalysis || {}

    // Count specific activity results
    const letterActivities = responses.filter(r => r.type === 'letter')
    const letterReversals = letterActivities.filter(r => !r.correct).length

    const countingActivities = responses.filter(r => r.type === 'counting')
    const countingErrors = countingActivities.filter(r => !r.correct).length

    const patternActivities = responses.filter(r => r.type === 'pattern')
    const patternCorrect = patternActivities.filter(r => r.correct).length

    const mathActivities = responses.filter(r => r.type === 'math')
    const mathCorrect = mathActivities.filter(r => r.correct).length

    const sequenceActivities = responses.filter(r => r.type === 'sequence')
    const sequenceCorrect = sequenceActivities.filter(r => r.correct).length

    return {
        // Dyslexia indicators
        letterReversal: letterReversals,
        readingHesitation: summary.avgResponseTime || 0,
        phonemeErrors: speechAnalysis.stammerCount || 0,
        rhymingDifficulty: letterActivities.length > 0 ? letterActivities.filter(r => r.correct).length / letterActivities.length : null,
        wordRecall: summary.avgResponseTime || 0,

        // Dyscalculia indicators
        numberSequencing: sequenceActivities.length > 0 ? sequenceCorrect / sequenceActivities.length : null,
        quantityEstimation: countingErrors,
        mathFactRecall: summary.avgResponseTime || 0,
        countingErrors: countingErrors,
        spatialMath: mathActivities.length > 0 ? mathCorrect / mathActivities.length : null,

        // ADHD indicators
        sustainedAttention: faceAnalysis.gazeStability || (faceAnalysis.gazeOnScreenPercent ? faceAnalysis.gazeOnScreenPercent / 100 : null),
        impulseControl: summary.totalCorrections || 0,
        gazeStability: faceAnalysis.gazeStability || (faceAnalysis.gazeOnScreenPercent ? faceAnalysis.gazeOnScreenPercent / 100 : null),
        taskSwitching: summary.avgResponseTime || 0,
        motorRestlessness: summary.totalMouseMovements || 0,

        // Auditory processing indicators
        speechFluency: speechAnalysis.speechRateWPM || null,
        verbalInstructions: responses.length > 0 ? responses.filter(r => r.correct).length / responses.length : null,
        auditoryMemory: speechAnalysis.totalWordsSpoken ? Math.min(5, Math.round(speechAnalysis.totalWordsSpoken / 10)) : null,
        soundDiscrimination: responses.length > 0 ? responses.filter(r => r.correct).length / responses.length : null,
        fillerUsage: speechAnalysis.fillerWordCount || 0,

        // Visual processing indicators
        patternRecognition: patternActivities.length > 0 ? patternCorrect / patternActivities.length : null,
        shapeMatching: patternActivities.length > 0 ? patternCorrect / patternActivities.length : null,
        visualMemory: patternActivities.length > 0 ? patternCorrect : null,
        spatialOrientation: mathActivities.length > 0 ? mathCorrect / mathActivities.length : null
    }
}

/**
 * Generate screening priority
 */
export function getScreeningPriority(results) {
    let screenCount = 0
    let watchCount = 0
    const concernAreas = []

    Object.entries(results).forEach(([key, result]) => {
        if (result.overallStatus === 'SCREEN') {
            screenCount++
            concernAreas.push(result.name)
        } else if (result.overallStatus === 'WATCH') {
            watchCount++
        }
    })

    if (screenCount >= 2) return { priority: 'HIGH', reason: 'Multiple areas require screening', areas: concernAreas }
    if (screenCount >= 1) return { priority: 'HIGH', reason: 'Elevated indicators in key domain', areas: concernAreas }
    if (watchCount >= 3) return { priority: 'MEDIUM', reason: 'Multiple areas showing patterns', areas: concernAreas }
    if (watchCount >= 1) return { priority: 'LOW', reason: 'Minor patterns observed', areas: concernAreas }
    return { priority: 'NONE', reason: 'All areas within typical range', areas: [] }
}

/**
 * Generate human-readable summary for AI prompt
 */
export function generateDetectionSummary(results) {
    const lines = []

    Object.entries(results).forEach(([key, result]) => {
        if (result.dataAvailable) {
            lines.push(`${result.icon} ${result.name}: ${result.overallStatus} (${result.overallScore}% concern score)`)

            Object.entries(result.indicators).forEach(([ind, data]) => {
                if (data.status !== 'TYPICAL') {
                    lines.push(`   - ${data.label}: ${data.observed} (expected ${data.expected}, ${data.deviation > 0 ? '+' : ''}${data.deviation}%)`)
                }
            })
        }
    })

    return lines.join('\n')
}
