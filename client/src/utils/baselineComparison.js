/**
 * ADHARA Baseline Comparison Utility
 * 
 * Compares live user metrics against age-appropriate baselines
 * and prepares data for LLM analysis.
 * 
 * All baselines are SYNTHETIC and for demonstration only.
 */

import baselineDataset from '../../data/baseline_dataset.json'

// Re-export for convenience
export const BASELINE_DATA = baselineDataset

/**
 * Age-based baseline thresholds
 */
export const AGE_BASELINES = {
    '6-8': baselineDataset.age_groups['6-8'].mouse,
    '9-11': baselineDataset.age_groups['9-11'].mouse,
    '12-14': baselineDataset.age_groups['12-14'].mouse,
    '15+': baselineDataset.age_groups['15+'].mouse,
}

/**
 * Friction level thresholds
 */
export const FRICTION_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.7,
    HIGH: 1.0,
}

/**
 * Get baseline metrics for a specific age group
 * @param {string} ageGroup - Age group key (e.g., '9-11')
 * @returns {object} Baseline metrics for the age group
 */
export function getBaselineForAge(ageGroup) {
    const group = baselineDataset.age_groups[ageGroup]
    if (!group) {
        console.warn(`[BaselineComparison] Unknown age group: ${ageGroup}, defaulting to 9-11`)
        return baselineDataset.age_groups['9-11']
    }
    return group
}

/**
 * Calculate percentage deviation between live value and baseline
 * @param {number} liveValue - Observed value
 * @param {number} baselineValue - Expected baseline value
 * @returns {number} Deviation as a ratio (0.5 = 50% deviation)
 */
export function calculateDeviation(liveValue, baselineValue) {
    if (baselineValue === 0) return 0
    return Math.abs(liveValue - baselineValue) / baselineValue
}

/**
 * Calculate deviations for all metrics
 * @param {object} liveMetrics - Live metrics from tracker
 * @param {string} ageGroup - Age group for baseline comparison
 * @returns {object} Deviation values for each metric
 */
export function calculateDeviations(liveMetrics, ageGroup) {
    const baseline = getBaselineForAge(ageGroup).mouse

    return {
        hesitation: calculateDeviation(
            liveMetrics.hesitationTime || liveMetrics.hesitationMs || 0,
            baseline.avgHesitationMs
        ),
        jitter: calculateDeviation(
            liveMetrics.mouseJitterScore || liveMetrics.jitterScore || 0,
            baseline.avgJitterScore
        ),
        corrections: calculateDeviation(
            liveMetrics.correctionCount || liveMetrics.corrections || 0,
            baseline.avgCorrections
        ),
        idleMotion: calculateDeviation(
            liveMetrics.idleWithMotionTime || liveMetrics.idleMotionMs || 0,
            baseline.avgIdleMotionMs
        ),
        speedVariance: calculateDeviation(
            liveMetrics.speedVariance || 0,
            baseline.avgSpeedVariance
        ),
    }
}

/**
 * Determine friction level based on average deviation
 * @param {object} deviations - Deviation object from calculateDeviations
 * @returns {string} Friction level: 'low', 'medium', or 'high'
 */
export function determineFrictionLevel(deviations) {
    const values = Object.values(deviations)
    const avgDeviation = values.reduce((sum, v) => sum + v, 0) / values.length

    if (avgDeviation < FRICTION_THRESHOLDS.LOW) return 'low'
    if (avgDeviation < FRICTION_THRESHOLDS.MEDIUM) return 'medium'
    return 'high'
}

/**
 * Calculate category-specific friction percentages
 * @param {object} deviations - Deviation values
 * @returns {object} Friction percentages by category
 */
export function calculateCategoryFriction(deviations) {
    // Reading: hesitation + corrections
    const readingFriction = Math.min(
        ((deviations.hesitation + deviations.corrections) / 2) * 100,
        100
    )

    // Attention: idle motion + jitter
    const attentionFriction = Math.min(
        ((deviations.idleMotion + deviations.jitter) / 2) * 100,
        100
    )

    // Memory: speed variance + corrections
    const memoryFriction = Math.min(
        ((deviations.speedVariance + deviations.corrections) / 2) * 100,
        100
    )

    return {
        reading: Math.round(readingFriction),
        attention: Math.round(attentionFriction),
        memory: Math.round(memoryFriction),
    }
}

/**
 * Generate a prompt for the LLM with live metrics and baseline context
 * @param {object} liveMetrics - Live metrics from tracker
 * @param {string} ageGroup - Age group (e.g., '9-11')
 * @param {string} taskType - Type of task (e.g., 'reading_comprehension')
 * @param {string} learnerId - Learner identifier (synthetic)
 * @returns {string} Formatted prompt for Ollama
 */
export function generateLLMPrompt(liveMetrics, ageGroup, taskType = 'reading_comprehension', learnerId = 'learner_01') {
    const baseline = getBaselineForAge(ageGroup)
    const deviations = calculateDeviations(liveMetrics, ageGroup)
    const frictionLevel = determineFrictionLevel(deviations)
    const categoryFriction = calculateCategoryFriction(deviations)

    const inputData = {
        learner_id: learnerId,
        age_group: ageGroup,
        task_type: taskType,
        live_metrics: {
            hesitationMs: liveMetrics.hesitationTime || liveMetrics.hesitationMs || 0,
            jitterScore: liveMetrics.mouseJitterScore || liveMetrics.jitterScore || 0,
            corrections: liveMetrics.correctionCount || liveMetrics.corrections || 0,
            idleMotionMs: liveMetrics.idleWithMotionTime || liveMetrics.idleMotionMs || 0,
            speedVariance: liveMetrics.speedVariance || 0,
            taskDurationSec: liveMetrics.sessionDuration ? Math.round(liveMetrics.sessionDuration / 1000) : 0,
        },
        baseline_reference: {
            hesitationMs: baseline.mouse.avgHesitationMs,
            jitterScore: baseline.mouse.avgJitterScore,
            corrections: baseline.mouse.avgCorrections,
            idleMotionMs: baseline.mouse.avgIdleMotionMs,
            speedVariance: baseline.mouse.avgSpeedVariance,
        },
        calculated_deviations: deviations,
        preliminary_friction_level: frictionLevel,
        category_friction: categoryFriction,
    }

    return `Analyze the following learner interaction data and provide a friction assessment.

INPUT DATA:
${JSON.stringify(inputData, null, 2)}

Based on the baseline reference for age group ${ageGroup}, analyze the deviations and provide your assessment in the required output format.`
}

/**
 * Parse the LLM response into structured data
 * @param {string} response - Raw response from Ollama
 * @returns {object} Parsed friction assessment
 */
export function parseOllamaResponse(response) {
    try {
        // Extract friction level
        const levelMatch = response.match(/Friction Level:\s*(Low|Medium|High)/i)
        const level = levelMatch ? levelMatch[1].toLowerCase() : 'unknown'

        // Extract category breakdown
        const readingMatch = response.match(/Reading Friction:\s*(\d+)%/i)
        const attentionMatch = response.match(/Attention Friction:\s*(\d+)%/i)
        const memoryMatch = response.match(/Memory Friction:\s*(\d+)%/i)

        // Extract explanation
        const explanationMatch = response.match(/Explanation:\s*\n?([\s\S]*?)(?=\n\s*Recommendation:|$)/i)
        const explanation = explanationMatch ? explanationMatch[1].trim() : ''

        return {
            success: true,
            frictionLevel: level,
            categories: {
                reading: readingMatch ? parseInt(readingMatch[1]) : 0,
                attention: attentionMatch ? parseInt(attentionMatch[1]) : 0,
                memory: memoryMatch ? parseInt(memoryMatch[1]) : 0,
            },
            explanation: explanation,
            recommendation: 'Human review suggested',
            rawResponse: response,
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            rawResponse: response,
        }
    }
}

/**
 * Generate a plain-English summary without LLM
 * Useful as fallback when Ollama is unavailable
 * @param {object} liveMetrics - Live metrics
 * @param {string} ageGroup - Age group
 * @returns {object} Friction assessment
 */
export function generateLocalAssessment(liveMetrics, ageGroup) {
    const deviations = calculateDeviations(liveMetrics, ageGroup)
    const frictionLevel = determineFrictionLevel(deviations)
    const categories = calculateCategoryFriction(deviations)
    const baseline = getBaselineForAge(ageGroup).mouse

    // Build explanation
    const explanations = []

    if (deviations.hesitation > 0.3) {
        const direction = liveMetrics.hesitationTime > baseline.avgHesitationMs ? 'higher' : 'lower'
        const percent = Math.round(deviations.hesitation * 100)
        explanations.push(`Hesitation time was ${percent}% ${direction} than expected for this age group.`)
    }

    if (deviations.jitter > 0.3) {
        explanations.push('Observed elevated back-and-forth mouse movement patterns.')
    }

    if (deviations.corrections > 0.3) {
        explanations.push(`${liveMetrics.correctionCount || 0} correction patterns were observed.`)
    }

    if (deviations.speedVariance > 0.3) {
        explanations.push('Mouse movement speed showed irregular patterns.')
    }

    if (explanations.length === 0) {
        explanations.push('Interaction patterns are within expected range for this age group.')
    }

    return {
        success: true,
        frictionLevel: frictionLevel,
        categories: categories,
        explanation: explanations.join(' '),
        recommendation: 'Human review suggested',
        generatedLocally: true,
    }
}

/**
 * Get a reference scenario that matches the friction level
 * @param {string} ageGroup - Age group
 * @param {string} frictionLevel - Friction level
 * @param {string} taskType - Task type
 * @returns {object|null} Matching reference scenario
 */
export function getReferenceScenario(ageGroup, frictionLevel, taskType = 'reading_comprehension') {
    return baselineDataset.reference_scenarios.find(
        s => s.age_group === ageGroup &&
            s.friction_level === frictionLevel &&
            s.task_type === taskType
    ) || null
}

export default {
    getBaselineForAge,
    calculateDeviations,
    determineFrictionLevel,
    calculateCategoryFriction,
    generateLLMPrompt,
    parseOllamaResponse,
    generateLocalAssessment,
    getReferenceScenario,
    AGE_BASELINES,
    FRICTION_THRESHOLDS,
    BASELINE_DATA,
}
