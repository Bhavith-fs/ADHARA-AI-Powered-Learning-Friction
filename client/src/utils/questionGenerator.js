/**
 * Adaptive Question Generator - EXPANDED v2.0
 * 
 * Features:
 * - 80+ screening activities across 5 domains
 * - Max 3 tries per question (then auto-mark incorrect)
 * - Age-adaptive difficulty (6-8, 9-11, 12+)
 * - Follow-up questions when errors detected
 * - Random selection within domains for variety
 */

export const MAX_TRIES = 3

// Screening-focused activity bank organized by detection domain
export const SCREENING_ACTIVITIES = {
    // ============ DYSLEXIA SCREENING ============
    dyslexia: {
        domain: 'Phonological Processing',
        icon: '📖',
        activities: [
            // Letter Reversal Detection (b/d/p/q confusion)
            { id: 'dys_letter_bd_1', type: 'letter', category: 'letterReversal', difficulty: 1, question: "Which letter is this?", showLetter: 'b', options: ['b', 'd', 'p', 'q'], correct: 'b', followUp: 'dys_letter_bd_2' },
            { id: 'dys_letter_bd_2', type: 'letter', category: 'letterReversal', difficulty: 1, question: "Now find the letter 'd'", showLetter: 'd', options: ['b', 'd', 'p', 'q'], correct: 'd', followUp: 'dys_letter_pq_1' },
            { id: 'dys_letter_pq_1', type: 'letter', category: 'letterReversal', difficulty: 1, question: "Which letter is 'p'?", showLetter: 'p', options: ['b', 'd', 'p', 'q'], correct: 'p' },
            { id: 'dys_letter_q', type: 'letter', category: 'letterReversal', difficulty: 1, question: "Point to the letter 'q'", showLetter: 'q', options: ['b', 'd', 'p', 'q'], correct: 'q' },
            { id: 'dys_letter_m_n', type: 'letter', category: 'letterReversal', difficulty: 2, question: "Which letter is 'm'?", showLetter: 'm', options: ['m', 'n', 'w', 'u'], correct: 'm' },
            { id: 'dys_letter_w_m', type: 'letter', category: 'letterReversal', difficulty: 2, question: "Find the letter 'w'", showLetter: 'w', options: ['m', 'n', 'w', 'u'], correct: 'w' },

            // Rhyming Activities
            { id: 'dys_rhyme_1', type: 'rhyming', category: 'phonemeAwareness', difficulty: 1, question: "Which word rhymes with CAT? 🐱", targetWord: 'CAT', options: ['DOG', 'HAT', 'CUP', 'SUN'], correct: 'HAT', followUp: 'dys_rhyme_2' },
            { id: 'dys_rhyme_2', type: 'rhyming', category: 'phonemeAwareness', difficulty: 1, question: "Which word rhymes with BALL? ⚽", targetWord: 'BALL', options: ['TALL', 'BELL', 'BOOK', 'BIRD'], correct: 'TALL' },
            { id: 'dys_rhyme_3', type: 'rhyming', category: 'phonemeAwareness', difficulty: 1, question: "Find the word that rhymes with TREE 🌳", targetWord: 'TREE', options: ['BEE', 'TOY', 'CAR', 'DOG'], correct: 'BEE' },
            { id: 'dys_rhyme_4', type: 'rhyming', category: 'phonemeAwareness', difficulty: 2, question: "Which word rhymes with CAKE? 🎂", targetWord: 'CAKE', options: ['LAKE', 'COOK', 'CAPE', 'COME'], correct: 'LAKE' },
            { id: 'dys_rhyme_5', type: 'rhyming', category: 'phonemeAwareness', difficulty: 2, question: "Find the rhyme for NIGHT 🌙", targetWord: 'NIGHT', options: ['NEST', 'LIGHT', 'NOON', 'NINE'], correct: 'LIGHT' },
            { id: 'dys_rhyme_6', type: 'rhyming', category: 'phonemeAwareness', difficulty: 3, question: "Which rhymes with STATION? 🚉", targetWord: 'STATION', options: ['NATION', 'STATIC', 'STAPLE', 'STARING'], correct: 'NATION' },

            // Beginning Sound Activities
            { id: 'dys_sound_1', type: 'sound', category: 'phonemeAwareness', difficulty: 1, question: "Which word starts like SUN? ☀️", targetWord: 'SUN', options: ['SOCK', 'MOON', 'BALL', 'CAR'], correct: 'SOCK' },
            { id: 'dys_sound_2', type: 'sound', category: 'phonemeAwareness', difficulty: 1, question: "Which word starts like BALL? ⚽", targetWord: 'BALL', options: ['BAT', 'CAT', 'DOG', 'FISH'], correct: 'BAT' },
            { id: 'dys_sound_3', type: 'sound', category: 'phonemeAwareness', difficulty: 1, question: "Same starting sound as FISH? 🐟", targetWord: 'FISH', options: ['FORK', 'HAT', 'TREE', 'LAMP'], correct: 'FORK' },
            { id: 'dys_sound_4', type: 'sound', category: 'phonemeAwareness', difficulty: 2, question: "Starts like CHAIR? 🪑", targetWord: 'CHAIR', options: ['CHEESE', 'SHARE', 'HAIR', 'AIR'], correct: 'CHEESE' },

            // Phoneme Deletion (Advanced)
            { id: 'dys_delete_1', type: 'phonemeDelete', category: 'phonemeAwareness', difficulty: 2, question: "Say 'STOP'. Now say it without the 'S'", options: ['TOP', 'POP', 'HOP', 'SHOP'], correct: 'TOP' },
            { id: 'dys_delete_2', type: 'phonemeDelete', category: 'phonemeAwareness', difficulty: 2, question: "Say 'PLATE'. Now say it without the 'P'", options: ['LATE', 'RATE', 'GATE', 'ATE'], correct: 'LATE' },
            { id: 'dys_delete_3', type: 'phonemeDelete', category: 'phonemeAwareness', difficulty: 3, question: "Say 'BLEND'. Now say it without the 'B'", options: ['LEND', 'BLEND', 'END', 'LAND'], correct: 'LEND' },

            // Rapid Naming (Speed test)
            { id: 'dys_rapid_1', type: 'rapidNaming', category: 'wordRecall', difficulty: 1, question: "Name these pictures as FAST as you can! 🏃", images: ['🍎', '🐕', '🏠', '🌞'], instruction: "Click 🎤 and say all four names quickly", timed: true },
            { id: 'dys_rapid_2', type: 'rapidNaming', category: 'wordRecall', difficulty: 2, question: "Name these quickly! ⚡", images: ['🚗', '📖', '🎈', '🐱', '🌺', '⚽'], instruction: "Click 🎤 and name all six as fast as you can", timed: true }
        ]
    },

    // ============ DYSCALCULIA SCREENING ============
    dyscalculia: {
        domain: 'Numerical Cognition',
        icon: '🔢',
        activities: [
            // Number Sequencing
            { id: 'disc_seq_1', type: 'sequence', category: 'numberSequencing', difficulty: 1, question: "Put in order (smallest ➔ biggest):", items: [5, 2, 8, 1], correct: [1, 2, 5, 8], followUp: 'disc_seq_2' },
            { id: 'disc_seq_2', type: 'sequence', category: 'numberSequencing', difficulty: 1, question: "Order smallest to biggest:", items: [9, 3, 6, 1], correct: [1, 3, 6, 9] },
            { id: 'disc_seq_3', type: 'sequence', category: 'numberSequencing', difficulty: 2, question: "Put in order:", items: [12, 7, 15, 3, 9], correct: [3, 7, 9, 12, 15] },
            { id: 'disc_seq_4', type: 'sequence', category: 'numberSequencing', difficulty: 2, question: "Smallest to biggest:", items: [20, 5, 13, 8, 17], correct: [5, 8, 13, 17, 20] },
            { id: 'disc_seq_5', type: 'sequence', category: 'numberSequencing', difficulty: 3, question: "Order these:", items: [45, 23, 67, 12, 89, 34], correct: [12, 23, 34, 45, 67, 89] },

            // Counting
            { id: 'disc_count_1', type: 'counting', category: 'countingAccuracy', difficulty: 1, question: "How many stars? ⭐⭐⭐⭐", count: 4, options: [3, 4, 5, 6], correct: 4, followUp: 'disc_count_2' },
            { id: 'disc_count_2', type: 'counting', category: 'countingAccuracy', difficulty: 1, question: "Count the dots 🔵", count: 7, options: [6, 7, 8, 9], correct: 7 },
            { id: 'disc_count_3', type: 'counting', category: 'countingAccuracy', difficulty: 1, question: "How many hearts? ❤️", count: 5, options: [4, 5, 6, 7], correct: 5 },
            { id: 'disc_count_4', type: 'counting', category: 'countingAccuracy', difficulty: 2, question: "Count all the shapes ⭐🔺⭐🔺⭐⭐🔺⭐🔺", count: 9, options: [7, 8, 9, 10], correct: 9 },
            { id: 'disc_count_5', type: 'counting', category: 'countingAccuracy', difficulty: 2, question: "How many total? 🍎🍎🍎🍊🍊", count: 5, options: [3, 4, 5, 6], correct: 5 },

            // Math Facts - Addition
            { id: 'disc_add_1', type: 'math', category: 'mathFactRecall', difficulty: 1, question: "What is 2 + 3?", options: [4, 5, 6, 7], correct: 5, followUp: 'disc_add_2' },
            { id: 'disc_add_2', type: 'math', category: 'mathFactRecall', difficulty: 1, question: "What is 4 + 2?", options: [5, 6, 7, 8], correct: 6 },
            { id: 'disc_add_3', type: 'math', category: 'mathFactRecall', difficulty: 1, question: "What is 3 + 3?", options: [4, 5, 6, 7], correct: 6 },
            { id: 'disc_add_4', type: 'math', category: 'mathFactRecall', difficulty: 2, question: "What is 7 + 5?", options: [10, 11, 12, 13], correct: 12 },
            { id: 'disc_add_5', type: 'math', category: 'mathFactRecall', difficulty: 2, question: "What is 8 + 6?", options: [12, 13, 14, 15], correct: 14 },
            { id: 'disc_add_6', type: 'math', category: 'mathFactRecall', difficulty: 3, question: "What is 15 + 17?", options: [30, 31, 32, 33], correct: 32 },

            // Math Facts - Subtraction
            { id: 'disc_sub_1', type: 'math', category: 'mathFactRecall', difficulty: 1, question: "What is 5 - 2?", options: [2, 3, 4, 5], correct: 3 },
            { id: 'disc_sub_2', type: 'math', category: 'mathFactRecall', difficulty: 2, question: "What is 12 - 5?", options: [5, 6, 7, 8], correct: 7 },
            { id: 'disc_sub_3', type: 'math', category: 'mathFactRecall', difficulty: 3, question: "What is 24 - 16?", options: [6, 7, 8, 9], correct: 8 },

            // Quantity Comparison
            { id: 'disc_qty_1', type: 'quantity', category: 'quantityEstimation', difficulty: 1, question: "Which has MORE? 🟢🟢🟢🟢🟢 or 🔵🔵🔵", options: ['Green (5)', 'Blue (3)', 'Same'], correct: 'Green (5)' },
            { id: 'disc_qty_2', type: 'quantity', category: 'quantityEstimation', difficulty: 1, question: "Which has MORE? ⭐⭐⭐⭐ or 🌙🌙🌙🌙🌙🌙", options: ['Stars (4)', 'Moons (6)', 'Same'], correct: 'Moons (6)' },
            { id: 'disc_qty_3', type: 'quantity', category: 'quantityEstimation', difficulty: 2, question: "Which is bigger? 47 or 74", options: ['47', '74', 'Same'], correct: '74' },
            { id: 'disc_qty_4', type: 'quantity', category: 'quantityEstimation', difficulty: 2, question: "Which is smaller? 35 or 53", options: ['35', '53', 'Same'], correct: '35' },

            // Number Patterns
            { id: 'disc_patt_1', type: 'numberPattern', category: 'numberSequencing', difficulty: 2, question: "What comes next? 2, 4, 6, 8, __", options: [9, 10, 11, 12], correct: 10 },
            { id: 'disc_patt_2', type: 'numberPattern', category: 'numberSequencing', difficulty: 2, question: "What comes next? 5, 10, 15, __", options: [17, 18, 19, 20], correct: 20 },
            { id: 'disc_patt_3', type: 'numberPattern', category: 'numberSequencing', difficulty: 3, question: "What comes next? 1, 2, 4, 7, 11, __", options: [14, 15, 16, 17], correct: 16 }
        ]
    },

    // ============ ADHD/ATTENTION SCREENING ============
    adhd: {
        domain: 'Executive Function',
        icon: '🧠',
        activities: [
            // Impulse Control (Go/No-Go)
            { id: 'adhd_impulse_1', type: 'impulseControl', category: 'impulseControl', difficulty: 1, question: "Press ONLY when you see a STAR ⭐", instruction: "Wait for shapes. Only click for stars!", sequence: ['🔵', '⭐', '🔺', '⭐', '🟢', '⭐', '🔷'], correctClicks: 3, duration: 10000 },
            { id: 'adhd_impulse_2', type: 'impulseControl', category: 'impulseControl', difficulty: 2, question: "Click ONLY for the RED circle 🔴", instruction: "Don't click other colors!", sequence: ['🔵', '🔴', '🟢', '🔴', '🟡', '🔵', '🔴', '🟢'], correctClicks: 3, duration: 12000 },
            { id: 'adhd_impulse_3', type: 'impulseControl', category: 'impulseControl', difficulty: 2, question: "Press ONLY when you see a HEART ❤️", instruction: "Ignore all other shapes!", sequence: ['⭐', '❤️', '🔷', '⭐', '❤️', '🔺', '❤️', '⭐', '🔷'], correctClicks: 3, duration: 15000 },

            // Stroop-like interference
            { id: 'adhd_stroop_1', type: 'stroop', category: 'impulseControl', difficulty: 2, question: "What COLOR is this word? (not what it says!)", word: 'BLUE', displayColor: 'red', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Red' },
            { id: 'adhd_stroop_2', type: 'stroop', category: 'impulseControl', difficulty: 2, question: "What COLOR is this word?", word: 'GREEN', displayColor: 'yellow', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Yellow' },
            { id: 'adhd_stroop_3', type: 'stroop', category: 'impulseControl', difficulty: 3, question: "What COLOR is this word?", word: 'RED', displayColor: 'blue', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 'Blue' },

            // Working Memory - Digit Span
            { id: 'adhd_memory_1', type: 'workingMemory', category: 'workingMemory', difficulty: 1, question: "Remember and repeat: 3, 7, 2", sequence: [3, 7, 2], options: [[3, 7, 2], [7, 3, 2], [2, 7, 3], [3, 2, 7]], correct: 0, followUp: 'adhd_memory_2' },
            { id: 'adhd_memory_2', type: 'workingMemory', category: 'workingMemory', difficulty: 1, question: "Remember: 5, 1, 9", sequence: [5, 1, 9], options: [[5, 1, 9], [1, 5, 9], [9, 1, 5], [5, 9, 1]], correct: 0 },
            { id: 'adhd_memory_3', type: 'workingMemory', category: 'workingMemory', difficulty: 2, question: "Remember: 4, 1, 8, 5", sequence: [4, 1, 8, 5], options: [[4, 1, 8, 5], [1, 4, 8, 5], [4, 8, 1, 5], [5, 8, 1, 4]], correct: 0 },
            { id: 'adhd_memory_4', type: 'workingMemory', category: 'workingMemory', difficulty: 2, question: "Remember: 7, 2, 9, 4", sequence: [7, 2, 9, 4], options: [[7, 2, 9, 4], [2, 7, 9, 4], [7, 9, 2, 4], [4, 9, 2, 7]], correct: 0 },
            { id: 'adhd_memory_5', type: 'workingMemory', category: 'workingMemory', difficulty: 3, question: "Remember: 3, 8, 1, 6, 4", sequence: [3, 8, 1, 6, 4], options: [[3, 8, 1, 6, 4], [8, 3, 1, 6, 4], [3, 1, 8, 6, 4], [4, 6, 1, 8, 3]], correct: 0 },

            // Backwards Digit Span (harder)
            { id: 'adhd_memback_1', type: 'workingMemoryBackward', category: 'workingMemory', difficulty: 2, question: "Say these BACKWARDS: 2, 5", sequence: [2, 5], options: [[5, 2], [2, 5], [5, 5], [2, 2]], correct: 0 },
            { id: 'adhd_memback_2', type: 'workingMemoryBackward', category: 'workingMemory', difficulty: 3, question: "Say BACKWARDS: 4, 7, 1", sequence: [4, 7, 1], options: [[1, 7, 4], [4, 7, 1], [7, 4, 1], [1, 4, 7]], correct: 0 },

            // Sustained Attention
            { id: 'adhd_sustained_1', type: 'sustainedAttention', category: 'sustainedAttention', difficulty: 2, question: "Count ALL the red circles that appear", instruction: "Keep watching carefully!", duration: 15000, targetCount: 5 },
            { id: 'adhd_sustained_2', type: 'sustainedAttention', category: 'sustainedAttention', difficulty: 3, question: "Count the BLUE squares only", instruction: "Ignore other shapes!", duration: 20000, targetCount: 7 }
        ]
    },

    // ============ AUDITORY PROCESSING ============
    auditory: {
        domain: 'Auditory Processing',
        icon: '👂',
        activities: [
            // Verbal Repetition
            { id: 'aud_repeat_1', type: 'verbal', category: 'auditoryMemory', difficulty: 1, question: "Say this word:", word: "ELEPHANT", instruction: "Click 🎤 and say it clearly" },
            { id: 'aud_repeat_2', type: 'verbal', category: 'auditoryMemory', difficulty: 1, question: "Say this word:", word: "BUTTERFLY", instruction: "Click 🎤 and say it clearly" },
            { id: 'aud_repeat_3', type: 'verbal', category: 'auditoryMemory', difficulty: 1, question: "Say this word:", word: "CHOCOLATE", instruction: "Click 🎤 and say it clearly" },
            { id: 'aud_repeat_4', type: 'verbal', category: 'auditoryMemory', difficulty: 2, question: "Say these words in order:", word: "BANANA, UMBRELLA, TELEPHONE", instruction: "Say all three words" },
            { id: 'aud_repeat_5', type: 'verbal', category: 'auditoryMemory', difficulty: 2, question: "Say in order:", word: "CROCODILE, HELICOPTER, REFRIGERATOR", instruction: "Say all three clearly" },
            { id: 'aud_repeat_6', type: 'verbal', category: 'auditoryMemory', difficulty: 3, question: "Say this sentence:", word: "The quick brown fox jumps over the lazy dog", instruction: "Say the whole sentence" },

            // Sound Discrimination
            { id: 'aud_sound_1', type: 'soundMatch', category: 'soundDiscrimination', difficulty: 1, question: "Which word sounds DIFFERENT?", options: ['CAT', 'BAT', 'HAT', 'BALL'], correct: 'BALL' },
            { id: 'aud_sound_2', type: 'soundMatch', category: 'soundDiscrimination', difficulty: 1, question: "Which word sounds DIFFERENT?", options: ['PEN', 'TEN', 'HEN', 'PIN'], correct: 'PIN' },
            { id: 'aud_sound_3', type: 'soundMatch', category: 'soundDiscrimination', difficulty: 2, question: "Which word sounds DIFFERENT?", options: ['SHIP', 'CHIP', 'SHEEP', 'SIP'], correct: 'SIP' },
            { id: 'aud_sound_4', type: 'soundMatch', category: 'soundDiscrimination', difficulty: 2, question: "Which ends differently?", options: ['RING', 'SING', 'KING', 'RIM'], correct: 'RIM' },
            { id: 'aud_sound_5', type: 'soundMatch', category: 'soundDiscrimination', difficulty: 3, question: "Which has a different middle sound?", options: ['BIT', 'SIT', 'SEAT', 'FIT'], correct: 'SEAT' },

            // Following Instructions
            { id: 'aud_instruct_1', type: 'instruction', category: 'verbalInstructions', difficulty: 1, question: "Touch your nose", instruction: "Do what it says", responseType: 'action' },
            { id: 'aud_instruct_2', type: 'instruction', category: 'verbalInstructions', difficulty: 2, question: "Clap your hands then touch your head", instruction: "Do BOTH actions", responseType: 'action' }
        ]
    },

    // ============ VISUAL PROCESSING ============
    visual: {
        domain: 'Visual Processing',
        icon: '👁️',
        activities: [
            // Pattern Recognition
            { id: 'vis_pattern_1', type: 'pattern', category: 'patternRecognition', difficulty: 1, question: "What comes next? 🔴 🔵 🔴 🔵 ?", options: ['🔴', '🔵', '🟢', '🟡'], correct: '🔴', followUp: 'vis_pattern_2' },
            { id: 'vis_pattern_2', type: 'pattern', category: 'patternRecognition', difficulty: 1, question: "What comes next? ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ?", options: ['🌙', '⭐', '☀️', '🌟'], correct: '⭐' },
            { id: 'vis_pattern_3', type: 'pattern', category: 'patternRecognition', difficulty: 2, question: "What comes next? 🟢 🟢 🔵 🟢 🟢 🔵 ?", options: ['🔵', '🟢', '🔴', '🟡'], correct: '🟢' },
            { id: 'vis_pattern_4', type: 'pattern', category: 'patternRecognition', difficulty: 2, question: "Complete: 🔺 🔺 🔻 🔺 🔺 🔻 🔺 ?", options: ['🔺', '🔻', '🔷', '🔶'], correct: '🔺' },
            { id: 'vis_pattern_5', type: 'pattern', category: 'patternRecognition', difficulty: 2, question: "What's next? 1️⃣ 2️⃣ 1️⃣ 2️⃣ 3️⃣ 1️⃣ 2️⃣ 1️⃣ 2️⃣ 3️⃣ ?", options: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'], correct: '1️⃣' },
            { id: 'vis_pattern_6', type: 'pattern', category: 'patternRecognition', difficulty: 3, question: "Complete: 🔴 🔵 🔵 🔴 🔵 🔵 🔵 🔴 ?", options: ['🔴', '🔵', '🟢', '🟡'], correct: '🔵' },

            // Shape Matching - Find the different one
            { id: 'vis_shape_1', type: 'matching', category: 'shapeMatching', difficulty: 1, question: "Which shape is DIFFERENT?", shapes: ['🔵', '🔵', '🔵', '🟢'], options: [0, 1, 2, 3], correct: 3, optionLabels: ['1st', '2nd', '3rd', '4th'] },
            { id: 'vis_shape_2', type: 'matching', category: 'shapeMatching', difficulty: 1, question: "Find the odd one out", shapes: ['⭐', '⭐', '🌙', '⭐'], options: [0, 1, 2, 3], correct: 2, optionLabels: ['1st', '2nd', '3rd', '4th'] },
            { id: 'vis_shape_3', type: 'matching', category: 'shapeMatching', difficulty: 2, question: "Which is different?", shapes: ['🔺', '🔺', '🔺', '🔺', '🔻'], options: [0, 1, 2, 3, 4], correct: 4, optionLabels: ['1st', '2nd', '3rd', '4th', '5th'] },
            { id: 'vis_shape_4', type: 'matching', category: 'shapeMatching', difficulty: 2, question: "Find the different one", shapes: ['🟦', '🟦', '🟪', '🟦', '🟦'], options: [0, 1, 2, 3, 4], correct: 2, optionLabels: ['1st', '2nd', '3rd', '4th', '5th'] },

            // Puzzle/Spatial Completion
            { id: 'vis_puzzle_1', type: 'puzzle', category: 'spatialOrientation', difficulty: 1, question: "Which piece fits the gap?", pattern: ['🟦', '🟦', '🟦', '🟦', '❓', '🟦', '🟦', '🟦', '🟦'], options: ['🟦', '🟥', '🟨', '🟩'], correct: '🟦' },
            { id: 'vis_puzzle_2', type: 'puzzle', category: 'spatialOrientation', difficulty: 2, question: "Complete the pattern", pattern: ['🔴', '🔵', '🔴', '🔵', '❓', '🔵'], options: ['🔴', '🔵', '🟢', '🟡'], correct: '🔴' },
            { id: 'vis_puzzle_3', type: 'puzzle', category: 'spatialOrientation', difficulty: 2, question: "Fill in the missing piece", pattern: ['⭐', '🌙', '⭐', '❓', '⭐', '🌙'], options: ['⭐', '🌙', '☀️', '🌟'], correct: '🌙' },

            // Visual Memory
            { id: 'vis_memory_1', type: 'visualMemory', category: 'visualMemory', difficulty: 1, question: "Which picture did you see?", showFirst: ['🍎', '🍊', '🍋'], hideAfter: 3000, options: [['🍎', '🍊', '🍋'], ['🍋', '🍎', '🍊'], ['🍊', '🍋', '🍎'], ['🍎', '🍋', '🍊']], correct: 0 },
            { id: 'vis_memory_2', type: 'visualMemory', category: 'visualMemory', difficulty: 2, question: "What was the order?", showFirst: ['🔴', '🔵', '🟢', '🟡'], hideAfter: 4000, options: [['🔴', '🔵', '🟢', '🟡'], ['🔵', '🔴', '🟢', '🟡'], ['🔴', '🟢', '🔵', '🟡'], ['🟡', '🔵', '🟢', '🔴']], correct: 0 },

            // Mirror/Rotation
            { id: 'vis_mirror_1', type: 'mirror', category: 'spatialOrientation', difficulty: 2, question: "Which is the mirror image of ➡️?", options: ['⬅️', '⬆️', '⬇️', '↗️'], correct: '⬅️' },
            { id: 'vis_mirror_2', type: 'mirror', category: 'spatialOrientation', difficulty: 3, question: "Which is rotated 180°? ⬆️", options: ['⬆️', '⬇️', '⬅️', '➡️'], correct: '⬇️' }
        ]
    }
}

/**
 * Generate an adaptive screening session
 * @param {number} age - Child's age
 * @param {object} previousResults - Previous session's detection results (optional)
 * @returns {array} - Ordered list of activities to present
 */
export function generateAdaptiveSession(age, previousResults = null) {
    const activities = []

    // Determine difficulty based on age
    const baseDifficulty = age < 8 ? 1 : age < 11 ? 2 : 3

    Object.entries(SCREENING_ACTIVITIES).forEach(([domain, data]) => {
        // Filter by difficulty
        const eligibleActivities = data.activities.filter(a => a.difficulty <= baseDifficulty)

        // Shuffle domain activities
        const shuffled = shuffleArray([...eligibleActivities])

        // Check if this domain needs deeper probing
        const needsDeepProbe = previousResults?.[domain]?.overallStatus === 'SCREEN' ||
            previousResults?.[domain]?.overallStatus === 'WATCH'

        // Select activities: 3-4 for normal, 5-6 for deep probe
        const count = needsDeepProbe ? Math.min(6, shuffled.length) : Math.min(3, shuffled.length)

        activities.push(...shuffled.slice(0, count).map(a => ({
            ...a,
            domain,
            domainName: data.domain,
            maxTries: MAX_TRIES,
            currentTries: 0
        })))
    })

    // Final shuffle to mix domains
    return shuffleArray(activities)
}

/**
 * Get follow-up activities based on incorrect responses
 */
export function getFollowUpActivities(incorrectActivityIds) {
    const followUps = []

    Object.values(SCREENING_ACTIVITIES).forEach(domain => {
        domain.activities.forEach(activity => {
            if (incorrectActivityIds.includes(activity.id) && activity.followUp) {
                const followUpActivity = domain.activities.find(a => a.id === activity.followUp)
                if (followUpActivity) {
                    followUps.push({ ...followUpActivity, isFollowUp: true, maxTries: MAX_TRIES, currentTries: 0 })
                }
            }
        })
    })

    return followUps
}

/**
 * Utility: Shuffle array
 */
function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Generate AI prompt context about the screening session
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
                avgTime: 0,
                times: [],
                triesUsed: []
            }
        }

        domainResults[domain].total++
        if (response?.correct) {
            domainResults[domain].correct++
        } else if (response) {
            domainResults[domain].errors.push({
                question: activity.question,
                category: activity.category,
                expected: activity.correct,
                given: response.answer,
                tries: response.tries || 1
            })
        }

        if (response?.responseTimeMs) {
            domainResults[domain].times.push(response.responseTimeMs)
        }
        if (response?.tries) {
            domainResults[domain].triesUsed.push(response.tries)
        }
    })

    // Calculate averages
    Object.values(domainResults).forEach(domain => {
        if (domain.times.length > 0) {
            domain.avgTime = Math.round(domain.times.reduce((a, b) => a + b, 0) / domain.times.length)
        }
        domain.accuracy = domain.total > 0 ? Math.round((domain.correct / domain.total) * 100) : 0
        if (domain.triesUsed.length > 0) {
            domain.avgTries = (domain.triesUsed.reduce((a, b) => a + b, 0) / domain.triesUsed.length).toFixed(1)
        }
    })

    return domainResults
}
