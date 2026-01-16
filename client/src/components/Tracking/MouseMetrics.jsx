import { Activity, AlertTriangle, MousePointer, Timer, RefreshCw, Gauge } from 'lucide-react'

/**
 * FrictionIndicator - Visual badge showing friction level
 */
export function FrictionIndicator({ level, size = 'md' }) {
    const config = {
        low: {
            label: 'Low Friction',
            bgClass: 'bg-emerald-100',
            textClass: 'text-emerald-700',
            borderClass: 'border-emerald-300',
            icon: Activity,
        },
        medium: {
            label: 'Medium Friction',
            bgClass: 'bg-amber-100',
            textClass: 'text-amber-700',
            borderClass: 'border-amber-300',
            icon: AlertTriangle,
        },
        high: {
            label: 'High Friction',
            bgClass: 'bg-red-100',
            textClass: 'text-red-700',
            borderClass: 'border-red-300',
            icon: AlertTriangle,
        },
    }

    const { label, bgClass, textClass, borderClass, icon: Icon } = config[level] || config.low
    const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${bgClass} ${textClass} ${borderClass} ${sizeClasses}`}>
            <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
            {label}
        </span>
    )
}

/**
 * MetricCard - Individual metric display
 */
export function MetricCard({ label, value, unit, icon: Icon, deviation, baseline }) {
    const deviationLevel = deviation < 0.3 ? 'normal' : deviation < 0.7 ? 'elevated' : 'high'
    const deviationColors = {
        normal: 'text-emerald-600',
        elevated: 'text-amber-600',
        high: 'text-red-600',
    }

    return (
        <div className="card">
            <div className="flex items-start justify-between mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-600" />
                </div>
                {deviation !== undefined && (
                    <span className={`text-xs font-medium ${deviationColors[deviationLevel]}`}>
                        {deviation > 0.5 ? '↑' : ''} {(deviation * 100).toFixed(0)}% deviation
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-slate-900">
                {typeof value === 'number' ? value.toFixed(2) : value}
                {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
            </div>
            <div className="text-sm text-slate-600">{label}</div>
            {baseline !== undefined && (
                <div className="text-xs text-slate-400 mt-1">
                    Baseline: {baseline.toFixed(2)}
                </div>
            )}
        </div>
    )
}

/**
 * MouseMetricsPanel - Full metrics display panel
 */
export function MouseMetricsPanel({ results }) {
    if (!results) {
        return (
            <div className="card text-center py-8">
                <MousePointer className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tracking data available yet.</p>
                <p className="text-sm text-slate-400 mt-1">Start a learning task to begin tracking.</p>
            </div>
        )
    }

    const { metrics, baseline, deviations, frictionLevel, explanation, sessionDuration, rawData } = results

    return (
        <div className="space-y-6">
            {/* Friction Level Header */}
            <div className="card bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Interaction Analysis</h3>
                        <p className="text-sm text-slate-600">Session duration: {(sessionDuration / 1000).toFixed(1)}s</p>
                    </div>
                    <FrictionIndicator level={frictionLevel} size="md" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Hesitation Time"
                    value={metrics.hesitationTime}
                    unit="ms"
                    icon={Timer}
                    deviation={deviations.hesitation}
                    baseline={baseline.avgHesitationMs}
                />
                <MetricCard
                    label="Jitter Score"
                    value={metrics.mouseJitterScore}
                    icon={Activity}
                    deviation={deviations.jitter}
                    baseline={baseline.avgJitterScore}
                />
                <MetricCard
                    label="Corrections"
                    value={metrics.correctionCount}
                    icon={RefreshCw}
                    deviation={deviations.corrections}
                    baseline={baseline.avgCorrections}
                />
                <MetricCard
                    label="Speed Variance"
                    value={metrics.speedVariance}
                    icon={Gauge}
                    deviation={deviations.speedVariance}
                    baseline={baseline.avgSpeedVariance}
                />
            </div>

            {/* Explanation */}
            <div className="card">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Analysis Summary
                </h4>
                <p className="text-slate-600">{explanation.summary}</p>

                {explanation.details.length > 1 && (
                    <ul className="mt-3 space-y-1">
                        {explanation.details.map((detail, i) => (
                            <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                                <span className="text-slate-400 mt-0.5">•</span>
                                {detail}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Raw Stats */}
            <div className="card bg-slate-50">
                <h4 className="font-medium text-slate-700 mb-3">Raw Interaction Data</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-xl font-bold text-slate-900">{rawData.movementCount}</div>
                        <div className="text-xs text-slate-500">Movements</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">{rawData.clickCount}</div>
                        <div className="text-xs text-slate-500">Clicks</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">{rawData.hoverCount}</div>
                        <div className="text-xs text-slate-500">Hovers</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-900">{rawData.correctionCount}</div>
                        <div className="text-xs text-slate-500">Corrections</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * LiveMetricsBar - Compact live metrics during tracking
 */
export function LiveMetricsBar({ metrics, isTracking }) {
    if (!isTracking || !metrics) return null

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-slate-200 px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Tracking</span>
            </div>
            <div className="text-sm text-slate-600">
                <span className="font-medium">{metrics.correctionCount}</span> corrections
            </div>
            <div className="text-sm text-slate-600">
                <span className="font-medium">{metrics.mouseJitterScore?.toFixed(2) || 0}</span> jitter
            </div>
            <div className="text-sm text-slate-600">
                <span className="font-medium">{metrics.hesitationTime?.toFixed(0) || 0}</span>ms hesitation
            </div>
        </div>
    )
}

export default MouseMetricsPanel
