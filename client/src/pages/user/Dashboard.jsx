import { Link } from 'react-router-dom'
import { BookOpen, Clock, CheckCircle, Play, FileText, MousePointer } from 'lucide-react'

function UserDashboard() {
    // Check for completed assessments
    const lastResult = localStorage.getItem('adhara_last_result')
    const hasCompletedTask = !!lastResult

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome */}
            <div className="text-center mb-12">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome, Learner</h1>
                <p className="text-slate-600">
                    Complete the learning tasks below while we observe interaction patterns
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="card text-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">2</div>
                    <div className="text-sm text-slate-500">Available</div>
                </div>
                <div className="card text-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <MousePointer className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">Active</div>
                    <div className="text-sm text-slate-500">Tracking</div>
                </div>
                <div className="card text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{hasCompletedTask ? 1 : 0}</div>
                    <div className="text-sm text-slate-500">Completed</div>
                </div>
            </div>

            {/* Available Tasks */}
            <div className="card mb-6">
                <h2 className="font-semibold text-slate-900 mb-4">Available Tasks</h2>

                <div className="space-y-4">
                    {/* Reading Task */}
                    <Link
                        to="/user/reading-task"
                        className="block p-4 rounded-lg border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                    <BookOpen className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Reading Assessment</h3>
                                    <p className="text-sm text-slate-500">Read a passage and answer comprehension questions</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-5 h-5" />
                                <span className="font-medium">Start</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                Mouse Tracking
                            </span>
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                5-10 min
                            </span>
                        </div>
                    </Link>

                    {/* Coming Soon Tasks */}
                    <div className="p-4 rounded-lg border-2 border-dashed border-slate-200 opacity-60">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-500">Writing Task</h3>
                                <p className="text-sm text-slate-400">Coming soon — keyboard pattern detection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Past Results */}
            {hasCompletedTask && (
                <div className="card bg-emerald-50 border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            <span className="font-medium text-emerald-900">You have completed assessment results</span>
                        </div>
                        <Link
                            to="/user/complete"
                            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                        >
                            View Results →
                        </Link>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                <h4 className="font-medium text-slate-700 mb-2">ℹ️ How This Works</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Your mouse movements are tracked during tasks (no webcam or biometrics)</li>
                    <li>• We analyze interaction patterns like hesitation and corrections</li>
                    <li>• Results are compared against age-appropriate baselines</li>
                    <li>• All analysis is for demonstration purposes only</li>
                </ul>
            </div>
        </div>
    )
}

export default UserDashboard
