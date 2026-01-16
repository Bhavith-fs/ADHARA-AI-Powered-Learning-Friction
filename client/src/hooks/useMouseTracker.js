import { useState, useEffect, useCallback, useRef } from 'react'
import { MouseTracker, AGE_BASELINES } from '../utils/mouseTracker'

/**
 * React hook for mouse interaction tracking
 * 
 * Usage:
 * const { startTracking, stopTracking, results, isTracking } = useMouseTracker('9-11')
 */
export function useMouseTracker(ageGroup = '9-11') {
    const [isTracking, setIsTracking] = useState(false)
    const [results, setResults] = useState(null)
    const [liveMetrics, setLiveMetrics] = useState(null)
    const trackerRef = useRef(null)
    const intervalRef = useRef(null)

    // Initialize tracker
    useEffect(() => {
        trackerRef.current = new MouseTracker(document, ageGroup)

        return () => {
            if (trackerRef.current) {
                trackerRef.current.stop()
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [ageGroup])

    // Start tracking
    const startTracking = useCallback((targetElement = document) => {
        if (trackerRef.current) {
            trackerRef.current.target = targetElement
            trackerRef.current.start()
            setIsTracking(true)
            setResults(null)

            // Update live metrics every 500ms
            intervalRef.current = setInterval(() => {
                if (trackerRef.current) {
                    const currentResults = trackerRef.current.getResults()
                    setLiveMetrics(currentResults.metrics)
                }
            }, 500)
        }
    }, [])

    // Stop tracking and get results
    const stopTracking = useCallback(() => {
        if (trackerRef.current) {
            const finalResults = trackerRef.current.stop()
            setResults(finalResults)
            setIsTracking(false)

            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }

            return finalResults
        }
        return null
    }, [])

    // Reset tracker
    const resetTracker = useCallback(() => {
        if (trackerRef.current) {
            trackerRef.current.reset()
            setResults(null)
            setLiveMetrics(null)
        }
    }, [])

    return {
        isTracking,
        startTracking,
        stopTracking,
        resetTracker,
        results,
        liveMetrics,
        ageGroups: Object.keys(AGE_BASELINES),
    }
}

export default useMouseTracker
