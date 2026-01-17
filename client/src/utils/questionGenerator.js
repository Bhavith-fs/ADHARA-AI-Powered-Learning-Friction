/**
 * ADHARA Learning Activities - Simplified & Tested v3.0
 * 
 * Only includes activity types that are fully tested and child-friendly.
 * Removed complex types (impulseControl, sustainedAttention, visualMemory) that had bugs.
 * 
 * Working activity types:
 * - letter (letter recognition)
 * - rhyming (find the rhyme)  
 * - sound (beginning sounds)
 * - counting (count objects)
 * - math (simple arithmetic)
 * - pattern (visual patterns)
 * - matching (find the different one)
 * - quantity (which has more)
 * - sequence (order numbers)
 * - soundMatch (which sounds different)
 * - verbal (speak words - requires mic)
 */

export const MAX_TRIES = 3

export const SCREENING_ACTIVITIES = {
    // ============ READING & WORDS ============
    dyslexia: {
        domain: 'Reading & Words',
        icon: '📖',
        activities: [
            // Letter Recognition (clear, simple)
            { id: 'letter_b', type: 'letter', category: 'letterRecognition', difficulty: 1, question: "Which letter is this?", showLetter: 'b', options: ['b', 'd', 'p', 'q'], correct: 'b' },
            { id: 'letter_d', type: 'letter', category: 'letterRecognition', difficulty: 1, question: "Which letter is this?", showLetter: 'd', options: ['b', 'd', 'p', 'q'], correct: 'd' },
            { id: 'letter_p', type: 'letter', category: 'letterRecognition', difficulty: 1, question: "Which letter is this?", showLetter: 'p', options: ['b', 'd', 'p', 'q'], correct: 'p' },
            { id: 'letter_m', type: 'letter', category: 'letterRecognition', difficulty: 1, question: "Which letter is this?", showLetter: 'm', options: ['m', 'n', 'u', 'w'], correct: 'm' },
            { id: 'letter_w', type: 'letter', category: 'letterRecognition', difficulty: 2, question: "Which letter is this?", showLetter: 'w', options: ['m', 'n', 'u', 'w'], correct: 'w' },

            // Rhyming (simple, clear rhymes)
            { id: 'rhyme_cat', type: 'rhyming', category: 'rhyming', difficulty: 1, question: "Which word rhymes with CAT? 🐱", targetWord: 'CAT', options: ['HAT', 'DOG', 'CUP', 'SUN'], correct: 'HAT' },
            { id: 'rhyme_ball', type: 'rhyming', category: 'rhyming', difficulty: 1, question: "Which word rhymes with BALL? ⚽", targetWord: 'BALL', options: ['TALL', 'BOOK', 'BIRD', 'MILK'], correct: 'TALL' },
            { id: 'rhyme_tree', type: 'rhyming', category: 'rhyming', difficulty: 1, question: "Which word rhymes with TREE? 🌳", targetWord: 'TREE', options: ['BEE', 'CAR', 'DOG', 'TOY'], correct: 'BEE' },
            { id: 'rhyme_cake', type: 'rhyming', category: 'rhyming', difficulty: 2, question: "Which word rhymes with CAKE? 🎂", targetWord: 'CAKE', options: ['LAKE', 'COOK', 'CALL', 'COLD'], correct: 'LAKE' },

            // Beginning Sounds (simple matching)
            { id: 'sound_sun', type: 'sound', category: 'sounds', difficulty: 1, question: "Which word starts like SUN? ☀️", targetWord: 'SUN', options: ['SOCK', 'MOON', 'BALL', 'CAR'], correct: 'SOCK' },
            { id: 'sound_ball', type: 'sound', category: 'sounds', difficulty: 1, question: "Which word starts like BALL? ⚽", targetWord: 'BALL', options: ['BAT', 'CAT', 'DOG', 'FISH'], correct: 'BAT' },
            { id: 'sound_fish', type: 'sound', category: 'sounds', difficulty: 1, question: "Which word starts like FISH? 🐟", targetWord: 'FISH', options: ['FORK', 'HAT', 'TREE', 'LAMP'], correct: 'FORK' }
        ]
    },

    // ============ NUMBERS & COUNTING ============
    dyscalculia: {
        domain: 'Numbers & Counting',
        icon: '🔢',
        activities: [
            // Simple Counting (actual visual items)
            { id: 'count_4', type: 'counting', category: 'counting', difficulty: 1, question: "How many stars? ⭐⭐⭐⭐", count: 4, options: [3, 4, 5, 6], correct: 4 },
            { id: 'count_5', type: 'counting', category: 'counting', difficulty: 1, question: "How many hearts? ❤️❤️❤️❤️❤️", count: 5, options: [4, 5, 6, 7], correct: 5 },
            { id: 'count_6', type: 'counting', category: 'counting', difficulty: 1, question: "How many circles? 🔵🔵🔵🔵🔵🔵", count: 6, options: [5, 6, 7, 8], correct: 6 },
            { id: 'count_3', type: 'counting', category: 'counting', difficulty: 1, question: "How many apples? 🍎🍎🍎", count: 3, options: [2, 3, 4, 5], correct: 3 },

            // Simple Math
            { id: 'add_2_3', type: 'math', category: 'math', difficulty: 1, question: "What is 2 + 3?", options: [4, 5, 6, 7], correct: 5 },
            { id: 'add_4_2', type: 'math', category: 'math', difficulty: 1, question: "What is 4 + 2?", options: [5, 6, 7, 8], correct: 6 },
            { id: 'add_3_3', type: 'math', category: 'math', difficulty: 1, question: "What is 3 + 3?", options: [4, 5, 6, 7], correct: 6 },
            { id: 'sub_5_2', type: 'math', category: 'math', difficulty: 1, question: "What is 5 - 2?", options: [2, 3, 4, 5], correct: 3 },
            { id: 'add_7_5', type: 'math', category: 'math', difficulty: 2, question: "What is 7 + 5?", options: [10, 11, 12, 13], correct: 12 },

            // Which has MORE (simple visual comparison)
            { id: 'qty_1', type: 'quantity', category: 'quantity', difficulty: 1, question: "Which group has MORE?", options: ['🟢🟢🟢🟢🟢 (5)', '🔵🔵🔵 (3)'], correct: '🟢🟢🟢🟢🟢 (5)' },
            { id: 'qty_2', type: 'quantity', category: 'quantity', difficulty: 1, question: "Which group has MORE?", options: ['⭐⭐⭐⭐ (4)', '🌙🌙🌙🌙🌙🌙 (6)'], correct: '🌙🌙🌙🌙🌙🌙 (6)' },

            // Simple Number Order
            { id: 'seq_1', type: 'sequence', category: 'numberOrder', difficulty: 1, question: "Put in order (smallest to biggest):", items: [5, 2, 8, 1], correct: [1, 2, 5, 8] },
            { id: 'seq_2', type: 'sequence', category: 'numberOrder', difficulty: 1, question: "Put in order (smallest to biggest):", items: [9, 3, 6, 1], correct: [1, 3, 6, 9] }
        ]
    },

    // ============ FOCUS & ATTENTION ============
    adhd: {
        domain: 'Focus & Attention',
        icon: '🧠',
        activities: [
            // Working Memory (remember sequence - simple)
            { id: 'mem_3', type: 'workingMemory', category: 'memory', difficulty: 1, question: "Remember this order: 3, 7, 2", sequence: [3, 7, 2], options: [[3, 7, 2], [7, 3, 2], [2, 7, 3], [3, 2, 7]], correct: 0 },
            { id: 'mem_4', type: 'workingMemory', category: 'memory', difficulty: 1, question: "Remember this order: 5, 1, 9", sequence: [5, 1, 9], options: [[5, 1, 9], [1, 5, 9], [9, 1, 5], [5, 9, 1]], correct: 0 },
            { id: 'mem_5', type: 'workingMemory', category: 'memory', difficulty: 2, question: "Remember this order: 4, 1, 8, 5", sequence: [4, 1, 8, 5], options: [[4, 1, 8, 5], [1, 4, 8, 5], [4, 8, 1, 5], [5, 8, 1, 4]], correct: 0 },

            // Stroop (color naming - simple)
            { id: 'stroop_1', type: 'stroop', category: 'attention', difficulty: 2, question: "What COLOR is this word? (not what it says!)", word: 'BLUE', displayColor: 'red', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Red' },
            { id: 'stroop_2', type: 'stroop', category: 'attention', difficulty: 2, question: "What COLOR is this word?", word: 'GREEN', displayColor: 'yellow', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Yellow' }
        ]
    },

    // ============ LISTENING & SPEAKING ============
    auditory: {
        domain: 'Listening & Speaking',
        icon: '👂',
        activities: [
            // Which sounds different
            { id: 'sound_diff_1', type: 'soundMatch', category: 'listening', difficulty: 1, question: "Which word sounds DIFFERENT?", options: ['CAT', 'BAT', 'HAT', 'BALL'], correct: 'BALL' },
            { id: 'sound_diff_2', type: 'soundMatch', category: 'listening', difficulty: 1, question: "Which word sounds DIFFERENT?", options: ['PEN', 'TEN', 'HEN', 'DOG'], correct: 'DOG' },
            { id: 'sound_diff_3', type: 'soundMatch', category: 'listening', difficulty: 1, question: "Which word sounds DIFFERENT?", options: ['CAKE', 'LAKE', 'CAR', 'MAKE'], correct: 'CAR' },

            // Verbal repetition (simple words)
            { id: 'verbal_1', type: 'verbal', category: 'speaking', difficulty: 1, question: "Say this word out loud:", word: "ELEPHANT 🐘", instruction: "Click 🎤 and say the word" },
            { id: 'verbal_2', type: 'verbal', category: 'speaking', difficulty: 1, question: "Say this word out loud:", word: "BUTTERFLY 🦋", instruction: "Click 🎤 and say the word" }
        ]
    },

    // ============ VISUAL PATTERNS ============
    visual: {
        domain: 'Visual Patterns',
        icon: '👁️',
        activities: [
            // Simple patterns (clear, logical)
            { id: 'pattern_1', type: 'pattern', category: 'patterns', difficulty: 1, question: "What comes next? 🔴 🔵 🔴 🔵 ?", options: ['🔴', '🔵', '🟢', '🟡'], correct: '🔴' },
            { id: 'pattern_2', type: 'pattern', category: 'patterns', difficulty: 1, question: "What comes next? ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ?", options: ['⭐', '🌙', '☀️', '🌟'], correct: '⭐' },
            { id: 'pattern_3', type: 'pattern', category: 'patterns', difficulty: 1, question: "What comes next? 🟢 🔵 🟢 🔵 ?", options: ['🔴', '🔵', '🟢', '🟡'], correct: '🟢' },
            { id: 'pattern_4', type: 'pattern', category: 'patterns', difficulty: 2, question: "What comes next? 🔺 🔺 🔻 🔺 🔺 🔻 ?", options: ['🔺', '🔻', '🔷', '🔶'], correct: '🔺' },

            // Find the different one (simple visual)
            { id: 'match_1', type: 'matching', category: 'visual', difficulty: 1, question: "Which shape is DIFFERENT?", shapes: ['🔵', '🔵', '🔵', '🟢'], options: [0, 1, 2, 3], correct: 3, optionLabels: ['1st', '2nd', '3rd', '4th'] },
            { id: 'match_2', type: 'matching', category: 'visual', difficulty: 1, question: "Find the odd one out:", shapes: ['⭐', '⭐', '🌙', '⭐'], options: [0, 1, 2, 3], correct: 2, optionLabels: ['1st', '2nd', '3rd', '4th'] },
            { id: 'match_3', type: 'matching', category: 'visual', difficulty: 1, question: "Which one is different?", shapes: ['❤️', '❤️', '❤️', '💚'], options: [0, 1, 2, 3], correct: 3, optionLabels: ['1st', '2nd', '3rd', '4th'] }
        ]
    }
}

/**
 * Generate a session with simple, tested activities
 * @param {number} age - Child's age
 * @returns {array} - Ordered list of activities
 */
export function generateAdaptiveSession(age) {
    const activities = []
    const baseDifficulty = age < 8 ? 1 : age < 11 ? 2 : 3

    Object.entries(SCREENING_ACTIVITIES).forEach(([domain, data]) => {
        // Get activities appropriate for age
        const eligible = data.activities.filter(a => a.difficulty <= baseDifficulty)

        // Shuffle and take 2-3 from each domain
        const shuffled = [...eligible].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, Math.min(3, shuffled.length))

        activities.push(...selected.map(a => ({
            ...a,
            domain,
            domainName: data.domain,
            maxTries: MAX_TRIES,
            currentTries: 0
        })))
    })

    // Final shuffle to mix domains
    return activities.sort(() => Math.random() - 0.5)
}

/**
 * Get follow-up activities (simplified - not used in basic version)
 */
export function getFollowUpActivities(incorrectActivityIds) {
    return []
}

/**
 * Generate context for AI analysis
 */
export function generateScreeningContext(activities, responses) {
    const domainResults = {}

    activities.forEach((activity, index) => {
        const response = responses[index]
        const domain = activity.domain

        if (!domainResults[domain]) {
            domainResults[domain] = {
                name: activity.domainName,
                total: 0,
                correct: 0,
                errors: [],
                times: []
            }
        }

        domainResults[domain].total++
        if (response?.correct) {
            domainResults[domain].correct++
        } else if (response) {
            domainResults[domain].errors.push({
                question: activity.question,
                category: activity.category
            })
        }

        if (response?.responseTimeMs) {
            domainResults[domain].times.push(response.responseTimeMs)
        }
    })

    // Calculate stats
    Object.values(domainResults).forEach(domain => {
        domain.accuracy = domain.total > 0 ? Math.round((domain.correct / domain.total) * 100) : 0
        domain.avgTime = domain.times.length > 0
            ? Math.round(domain.times.reduce((a, b) => a + b, 0) / domain.times.length)
            : 0
    })

    return domainResults
}
