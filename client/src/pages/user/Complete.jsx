import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowLeft, BookOpen, Clock, MousePointer, AlertTriangle } from 'lucide-react'
import { MouseMetricsPanel, FrictionIndicator } from '../../components/Tracking/MouseMetrics'

function UserComplete() {
    const [results, setResults] = useState(null)

    useEffect(() => {
        // Load results from localStorage
        const savedResults = localStorage.getItem('adhara_last_result')
        if (savedResults) {
            try {
                setResults(JSON.parse(savedResults))
            } catch (e) {
                console.error('Failed to parse results:', e)
            }
        }
    }, [])

    // Calculate quiz score
    const getScore = () => {
        if (!results?.passage?.questions || !results?.answers) return { correct: 0, total: 0 }
        let correct = 0
        results.passage.questions.forEach(q => {
            if (results.answers[q.id] === q.correct) correct++
        })
        return { correct, total: results.passage.questions.length }
    }

    const score = getScore()

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    to="/user"
                    className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Assessment Results</h1>
            </div>

            {results ? (
                <div className="space-y-6">
                    {/* Success Banner */}
                    <div className="card bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-emerald-200 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-emerald-900">Assessment Complete!</h2>
                                <p className="text-emerald-700">
                                    Completed on {new Date(results.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Task & Score Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <BookOpen className="w-5 h-5 text-primary-600" />
                                <span className="font-medium text-slate-700">Passage</span>
                            </div>
                            <div className="text-lg font-semibold text-slate-900">
                                {results.passage?.title || 'Reading Task'}
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock className="w-5 h-5 text-amber-600" />
                                <span className="font-medium text-slate-700">Reading Time</span>
                            </div>
                            <div className="text-lg font-semibold text-slate-900">
                                {Math.floor(results.readingTime / 60)}:{(results.readingTime % 60).toString().padStart(2, '0')}
                            </div>
                        </div>

                        <div className="card">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium text-slate-700">Quiz Score</span>
                            </div>
                            <div className="text-lg font-semibold text-slate-900">
                                {score.correct} / {score.total} correct
                            </div>
                        </div>
                    </div>

                    {/* Friction Level Summary */}
                    {results.mouseTracking && (
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <MousePointer className="w-5 h-5 text-slate-600" />
                                    <h3 className="font-semibold text-slate-900">Interaction Friction Analysis</h3>
                                </div>
                                <FrictionIndicator level={results.mouseTracking.frictionLevel} />
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                <p className="text-slate-700">{results.mouseTracking.explanation?.summary}</p>
                            </div>

                            <div className="text-sm text-slate-500">
                                Age group baseline: <span className="font-medium">{results.ageGroup} years</span>
                            </div>
                        </div>
                    )}

                    {/* Detailed Metrics */}
                    {results.mouseTracking && (
                        <>
                            <h3 className="text-lg font-semibold text-slate-900 mt-8">Detailed Metrics</h3>
                            <MouseMetricsPanel results={results.mouseTracking} />
                        </>
                    )}

                    {/* Disclaimer */}
                    <div className="card bg-amber-50 border-amber-200">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-amber-900 mb-1">Important Notice</h4>
                                <p className="text-sm text-amber-800">
                                    This analysis is for demonstration purposes only. It does not provide any medical,
                                    clinical, or diagnostic assessment. All findings should be reviewed by qualified
                                    educators and are not a substitute for professional evaluation.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 justify-center pt-4">
                        <Link to="/user" className="btn-secondary">
                            Back to Dashboard
                        </Link>
                        <Link to="/user/reading-task" className="btn-primary">
                            Take Another Assessment
                        </Link>
                    </div>
                </div>
            ) : (
                /* No Results State */
                <div className="card text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MousePointer className="w-10 h-10 text-slate-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        No Results Found
                    </h1>

                    <p className="text-slate-600 max-w-md mx-auto mb-8">
                        You haven't completed any assessments yet. Take a reading task to see your
                        interaction analysis results here.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link to="/user" className="btn-secondary">
                            Back to Dashboard
                        </Link>
                        <Link to="/user/reading-task" className="btn-primary">
                            Start Assessment
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserComplete
