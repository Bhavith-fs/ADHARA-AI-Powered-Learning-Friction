/**
 * ADHARA Mouse Interaction Tracker
 * 
 * Captures real-time mouse interaction patterns to detect learning friction.
 * Does NOT use biometrics, webcam, or any invasive sensing.
 * 
 * Metrics computed:
 * - mouse_jitter_score: Variance of movement direction (rapid back-and-forth)
 * - hesitation_time: Time between hover and click
 * - correction_count: Number of aborted clicks (hover → move away → hover again)
 * - idle_with_motion_time: Cursor moves but no meaningful action
 * - speed_variance: Erratic speed changes indicating uncertainty
 */

// Age-based synthetic baselines (heuristic, not clinical)
export const AGE_BASELINES = {
    '6-8': {
        avgHesitationMs: 2500,
        avgJitterScore: 0.4,
        avgCorrections: 3,
        avgIdleMotionMs: 4000,
        avgSpeedVariance: 0.5,
    },
    '9-11': {
        avgHesitationMs: 1800,
        avgJitterScore: 0.3,
        avgCorrections: 2,
        avgIdleMotionMs: 3000,
        avgSpeedVariance: 0.4,
    },
    '12-14': {
        avgHesitationMs: 1200,
        avgJitterScore: 0.2,
        avgCorrections: 1.5,
        avgIdleMotionMs: 2000,
        avgSpeedVariance: 0.3,
    },
    '15+': {
        avgHesitationMs: 800,
        avgJitterScore: 0.15,
        avgCorrections: 1,
        avgIdleMotionMs: 1500,
        avgSpeedVariance: 0.25,
    },
}

/**
 * MouseTracker class - captures and analyzes mouse interaction patterns
 */
export class MouseTracker {
    constructor(targetElement = document, ageGroup = '9-11') {
        this.target = targetElement
        this.ageGroup = ageGroup
        this.baseline = AGE_BASELINES[ageGroup] || AGE_BASELINES['9-11']

        // Raw event data
        this.movements = []
        this.clicks = []
        this.hovers = []

        // Computed metrics
        this.metrics = {
            mouseJitterScore: 0,
            hesitationTime: 0,
            correctionCount: 0,
            idleWithMotionTime: 0,
            speedVariance: 0,
            totalMovementDistance: 0,
            avgSpeed: 0,
        }

        // State tracking
        this.isTracking = false
        this.startTime = null
        this.lastPosition = null
        this.lastMoveTime = null
        this.hoverStartTime = null
        this.hoverTarget = null
        this.directions = []
        this.speeds = []
        this.idleMotionPeriods = []
        this.potentialClicks = [] // Track hover-then-leave patterns

        // Bind methods
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseClick = this.handleMouseClick.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    /**
     * Start tracking mouse interactions
     */
    start() {
        if (this.isTracking) return

        this.isTracking = true
        this.startTime = Date.now()
        this.reset()

        this.target.addEventListener('mousemove', this.handleMouseMove)
        this.target.addEventListener('click', this.handleMouseClick)

        // Track hover on interactive elements
        const interactiveElements = this.target.querySelectorAll('button, a, input, [role="button"]')
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', this.handleMouseEnter)
            el.addEventListener('mouseleave', this.handleMouseLeave)
        })

        console.log('[MouseTracker] Started tracking')
    }

    /**
     * Stop tracking and compute final metrics
     */
    stop() {
        if (!this.isTracking) return this.getResults()

        this.isTracking = false

        this.target.removeEventListener('mousemove', this.handleMouseMove)
        this.target.removeEventListener('click', this.handleMouseClick)

        const interactiveElements = this.target.querySelectorAll('button, a, input, [role="button"]')
        interactiveElements.forEach(el => {
            el.removeEventListener('mouseenter', this.handleMouseEnter)
            el.removeEventListener('mouseleave', this.handleMouseLeave)
        })

        this.computeMetrics()
        console.log('[MouseTracker] Stopped tracking')

        return this.getResults()
    }

    /**
     * Reset all tracking data
     */
    reset() {
        this.movements = []
        this.clicks = []
        this.hovers = []
        this.directions = []
        this.speeds = []
        this.idleMotionPeriods = []
        this.potentialClicks = []
        this.lastPosition = null
        this.lastMoveTime = null
        this.hoverStartTime = null
        this.hoverTarget = null
    }

    /**
     * Handle mouse movement events
     */
    handleMouseMove(e) {
        const now = Date.now()
        const position = { x: e.clientX, y: e.clientY, time: now }

        if (this.lastPosition) {
            // Calculate distance and speed
            const dx = position.x - this.lastPosition.x
            const dy = position.y - this.lastPosition.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const timeDelta = now - this.lastMoveTime

            if (timeDelta > 0) {
                const speed = distance / timeDelta
                this.speeds.push(speed)

                // Calculate direction (angle in radians)
                const direction = Math.atan2(dy, dx)
                this.directions.push(direction)

                // Track movement
                this.movements.push({
                    ...position,
                    distance,
                    speed,
                    direction,
                })
            }
        }

        this.lastPosition = position
        this.lastMoveTime = now
    }

    /**
     * Handle click events
     */
    handleMouseClick(e) {
        const now = Date.now()

        this.clicks.push({
            x: e.clientX,
            y: e.clientY,
            time: now,
            target: e.target.tagName,
            hesitationTime: this.hoverStartTime ? now - this.hoverStartTime : 0,
        })

        // Reset hover tracking after click
        this.hoverStartTime = null
        this.hoverTarget = null
    }

    /**
     * Handle mouse entering interactive elements
     */
    handleMouseEnter(e) {
        this.hoverStartTime = Date.now()
        this.hoverTarget = e.target

        this.hovers.push({
            target: e.target.tagName,
            startTime: this.hoverStartTime,
            element: e.target,
        })
    }

    /**
     * Handle mouse leaving interactive elements without clicking
     */
    handleMouseLeave(e) {
        if (this.hoverStartTime && this.hoverTarget === e.target) {
            const hoverDuration = Date.now() - this.hoverStartTime

            // If hovered for more than 200ms but didn't click, count as correction
            if (hoverDuration > 200) {
                this.potentialClicks.push({
                    target: e.target.tagName,
                    hoverDuration,
                    aborted: true,
                })
            }
        }

        this.hoverStartTime = null
        this.hoverTarget = null
    }

    /**
     * Compute all metrics from collected data
     */
    computeMetrics() {
        // 1. Mouse Jitter Score - variance of direction changes
        this.metrics.mouseJitterScore = this.computeJitterScore()

        // 2. Average Hesitation Time - time between hover and click
        this.metrics.hesitationTime = this.computeHesitationTime()

        // 3. Correction Count - aborted clicks
        this.metrics.correctionCount = this.potentialClicks.filter(p => p.aborted).length

        // 4. Speed Variance - erratic speed changes
        this.metrics.speedVariance = this.computeSpeedVariance()

        // 5. Idle with Motion Time - cursor moves but no action
        this.metrics.idleWithMotionTime = this.computeIdleMotionTime()

        // 6. Total movement distance
        this.metrics.totalMovementDistance = this.movements.reduce((sum, m) => sum + m.distance, 0)

        // 7. Average speed
        this.metrics.avgSpeed = this.speeds.length > 0
            ? this.speeds.reduce((a, b) => a + b, 0) / this.speeds.length
            : 0
    }

    /**
     * Compute jitter score from direction changes
     * High jitter = rapid back-and-forth motion
     */
    computeJitterScore() {
        if (this.directions.length < 3) return 0

        let directionChanges = 0
        for (let i = 1; i < this.directions.length; i++) {
            const angleDiff = Math.abs(this.directions[i] - this.directions[i - 1])
            // Significant direction change (more than 90 degrees)
            if (angleDiff > Math.PI / 2) {
                directionChanges++
            }
        }

        // Normalize by total movements
        return directionChanges / this.directions.length
    }

    /**
     * Compute average hesitation time before clicks
     */
    computeHesitationTime() {
        const hesitations = this.clicks.filter(c => c.hesitationTime > 0)
        if (hesitations.length === 0) return 0

        return hesitations.reduce((sum, c) => sum + c.hesitationTime, 0) / hesitations.length
    }

    /**
     * Compute speed variance (erratic movement indicator)
     */
    computeSpeedVariance() {
        if (this.speeds.length < 2) return 0

        const mean = this.speeds.reduce((a, b) => a + b, 0) / this.speeds.length
        const squaredDiffs = this.speeds.map(s => Math.pow(s - mean, 2))
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / this.speeds.length

        // Normalize to 0-1 range (assuming max variance of 4)
        return Math.min(Math.sqrt(variance) / 2, 1)
    }

    /**
     * Compute time spent moving cursor without taking action
     */
    computeIdleMotionTime() {
        if (this.movements.length === 0) return 0

        const sessionDuration = Date.now() - this.startTime
        const clickTimes = this.clicks.map(c => c.time)

        let idleMotionTime = 0
        let lastActionTime = this.startTime

        // Time between actions where cursor was still moving
        clickTimes.forEach(clickTime => {
            const gap = clickTime - lastActionTime
            // If gap > 2 seconds with movement, count as idle motion
            if (gap > 2000) {
                const movementsDuringGap = this.movements.filter(
                    m => m.time > lastActionTime && m.time < clickTime
                )
                if (movementsDuringGap.length > 5) {
                    idleMotionTime += gap
                }
            }
            lastActionTime = clickTime
        })

        return idleMotionTime
    }

    /**
     * Get friction level based on metrics vs baseline
     */
    getFrictionLevel() {
        const deviations = this.getDeviations()
        const avgDeviation = Object.values(deviations).reduce((a, b) => a + b, 0) / Object.keys(deviations).length

        if (avgDeviation < 0.3) return 'low'
        if (avgDeviation < 0.7) return 'medium'
        return 'high'
    }

    /**
     * Calculate deviations from age-baseline
     */
    getDeviations() {
        return {
            hesitation: Math.abs(this.metrics.hesitationTime - this.baseline.avgHesitationMs) / this.baseline.avgHesitationMs,
            jitter: Math.abs(this.metrics.mouseJitterScore - this.baseline.avgJitterScore) / Math.max(this.baseline.avgJitterScore, 0.1),
            corrections: Math.abs(this.metrics.correctionCount - this.baseline.avgCorrections) / Math.max(this.baseline.avgCorrections, 1),
            speedVariance: Math.abs(this.metrics.speedVariance - this.baseline.avgSpeedVariance) / Math.max(this.baseline.avgSpeedVariance, 0.1),
        }
    }

    /**
     * Generate plain-English explanation
     */
    generateExplanation() {
        const deviations = this.getDeviations()
        const frictionLevel = this.getFrictionLevel()
        const explanations = []

        if (deviations.hesitation > 0.5) {
            const direction = this.metrics.hesitationTime > this.baseline.avgHesitationMs ? 'higher' : 'lower'
            explanations.push(`Hesitation time before clicks is ${direction} than expected for this age group.`)
        }

        if (deviations.jitter > 0.5) {
            explanations.push('Observed increased back-and-forth mouse movement, indicating possible uncertainty.')
        }

        if (deviations.corrections > 0.5) {
            explanations.push(`${this.metrics.correctionCount} instances where cursor hovered over an option but moved away without clicking.`)
        }

        if (deviations.speedVariance > 0.5) {
            explanations.push('Mouse movement speed was inconsistent, showing irregular interaction patterns.')
        }

        if (explanations.length === 0) {
            explanations.push('Interaction patterns are within expected range for this age group.')
        }

        return {
            level: frictionLevel,
            summary: explanations.join(' '),
            details: explanations,
        }
    }

    /**
     * Get complete results
     */
    getResults() {
        this.computeMetrics()

        return {
            metrics: { ...this.metrics },
            baseline: { ...this.baseline },
            ageGroup: this.ageGroup,
            deviations: this.getDeviations(),
            frictionLevel: this.getFrictionLevel(),
            explanation: this.generateExplanation(),
            sessionDuration: Date.now() - this.startTime,
            rawData: {
                movementCount: this.movements.length,
                clickCount: this.clicks.length,
                hoverCount: this.hovers.length,
                correctionCount: this.potentialClicks.length,
            },
        }
    }
}

/**
 * Create a singleton tracker instance
 */
let trackerInstance = null

export function getMouseTracker(ageGroup = '9-11') {
    if (!trackerInstance) {
        trackerInstance = new MouseTracker(document, ageGroup)
    }
    return trackerInstance
}

export function resetMouseTracker() {
    if (trackerInstance) {
        trackerInstance.stop()
        trackerInstance = null
    }
}

export default MouseTracker
