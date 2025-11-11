import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TabState } from './types'

interface QueryState {
    query: string
    results: {
        records: Record<string, any>[]
        totalSize: number
        done: boolean
    } | null
    sortConfig: {
        column: string | null
        direction: 'asc' | 'desc'
    }
    filterValue: string
    autoCompleteEnabled: boolean
    orgDomain: string
}

interface SerializedTabState {
    prettyMode: boolean
    debugOnly: boolean
    searchQuery: string
    showTimeline: boolean
    showReplay: boolean
    showIndented: boolean
    selectedLine: number | null
    expandedLines: string[]
    selectedLineContent: {
        id: string
        pretty: string | null
        raw: string | null
    }
    enabledLineTypes: string[]
}

export interface Log {
    id: string
    user: string
    userId: string
    operation: string
    time: string
    duration: string
    status: string
    size: string
    content?: string
    durationMilliseconds?: number
}

interface LogsState {
    logs: Log[]
    selectedLogs: Array<{
        id: string
        content: string
        time: string
        duration: string
    }>
    tabStates: Record<string, SerializedTabState>
    activeTab: string
    isTableCollapsed: boolean
    currentUserOnly: boolean
    isLiveTailing: boolean
    countdown: number
    hasInitiallyFetched: boolean
}

// Helper functions to convert between TabState and SerializedTabState
export const serializeTabState = (state: TabState): SerializedTabState => ({
    ...state,
    expandedLines: Array.from(state.expandedLines),
    enabledLineTypes: Array.from(state.enabledLineTypes),
})

export const deserializeTabState = (state: SerializedTabState): TabState => ({
    ...state,
    expandedLines: new Set(state.expandedLines),
    enabledLineTypes: new Set(state.enabledLineTypes),
})

interface ExecuteState {
    code: string
    activeBlockId: string | null
    isDrawerOpen: boolean
}

interface TestsState {
    searchQuery: string
    currentPage: number
    testRuns: Array<{
        classId: string
        testRunId: string
        status: 'running' | 'completed'
        results?: any[]
        coverage?: any[]
        jobInfo?: any
        error?: string
    }>
    selectedClassId: string | null
}

interface TraceFlagsState {
    sortField: string
    sortDirection: 'asc' | 'desc'
}

interface DevConsoleState {
    query: QueryState
    logs: LogsState
    execute: ExecuteState
    tests: TestsState
    traceFlags: TraceFlagsState
    
    // Actions
    setQueryState: (state: Partial<QueryState>) => void
    setLogsState: (state: Partial<LogsState>) => void
    setExecuteState: (state: Partial<ExecuteState>) => void
    setTestsState: (state: Partial<TestsState>) => void
    setTraceFlagsState: (state: Partial<TraceFlagsState>) => void
    
    // Reset actions
    resetQueryState: () => void
    resetLogsState: () => void
    resetExecuteState: () => void
    resetTestsState: () => void
    resetTraceFlagsState: () => void
    resetAll: () => void
}

const initialQueryState: QueryState = {
    query: '',
    results: null,
    sortConfig: {
        column: null,
        direction: 'asc',
    },
    filterValue: '',
    autoCompleteEnabled: false,
    orgDomain: '',
}

const initialLogsState: LogsState = {
    logs: [],
    selectedLogs: [],
    tabStates: {},
    activeTab: '',
    isTableCollapsed: false,
    currentUserOnly: true,
    isLiveTailing: false,
    countdown: 5,
    hasInitiallyFetched: false,
}

const initialExecuteState: ExecuteState = {
    code: '',
    activeBlockId: null,
    isDrawerOpen: false,
}

const initialTestsState: TestsState = {
    searchQuery: '',
    currentPage: 1,
    testRuns: [],
    selectedClassId: null,
}

const initialTraceFlagsState: TraceFlagsState = {
    sortField: 'ExpirationDate',
    sortDirection: 'desc',
}

// Detect if this is a full page refresh vs navigation
const isFullPageRefresh = (): boolean => {
    if (typeof window === 'undefined') return false
    
    // Primary method: Check Performance Navigation API
    try {
        const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navEntry?.type === 'reload') {
            // Definitely a reload
            return true
        }
        if (navEntry?.type === 'back_forward') {
            // Browser back/forward - keep state
            return false
        }
        // If type is 'navigate', it could be either initial load or client-side nav
        // We need to check the navigation flag
    } catch (e) {
        // Performance API might not be available, fall through to flag check
    }
    
    // Check if we have a navigation flag
    // The flag is set by the layout on mount (client-side navigation)
    // If it doesn't exist, it could be:
    // 1. Initial page load (no state to preserve anyway)
    // 2. Full page refresh (state should be cleared)
    // 
    // To be safe, only clear if we're absolutely sure it's a refresh.
    // If the Performance API says 'navigate' and there's no flag, it's likely
    // a refresh (since client-side nav would have set the flag).
    // But if there's no existing state, it doesn't matter anyway.
    const navFlag = sessionStorage.getItem('devconsole_nav_flag')
    const existingState = sessionStorage.getItem('devconsole-state')
    
    // Only clear if:
    // 1. No navigation flag exists (wasn't set by client-side nav)
    // 2. AND there's existing state to clear (otherwise it's just initial load)
    // This prevents clearing state on initial page load when there's no state yet
    if (!navFlag && existingState) {
        return true
    }
    
    return false
}

export const useDevConsoleStore = create<DevConsoleState>()(
    persist(
        (set) => ({
            query: initialQueryState,
            logs: initialLogsState,
            execute: initialExecuteState,
            tests: initialTestsState,
            traceFlags: initialTraceFlagsState,
            
            setQueryState: (state) =>
                set((prev) => ({
                    query: { ...prev.query, ...state },
                })),
            
            setLogsState: (state) =>
                set((prev) => {
                    // If tabStates is being updated, serialize Sets to arrays
                    if (state.tabStates) {
                        const serializedTabStates: Record<string, SerializedTabState> = {}
                        Object.entries(state.tabStates).forEach(([key, value]) => {
                            if (value && typeof value === 'object' && 'expandedLines' in value) {
                                // Check if expandedLines is a Set (TabState) or array (SerializedTabState)
                                if (value.expandedLines instanceof Set) {
                                    serializedTabStates[key] = serializeTabState(value as unknown as TabState)
                                } else {
                                    // Already serialized, use as-is
                                    serializedTabStates[key] = value as SerializedTabState
                                }
                            } else {
                                serializedTabStates[key] = value as SerializedTabState
                            }
                        })
                        return {
                            logs: { ...prev.logs, ...state, tabStates: serializedTabStates },
                        }
                    }
                    return {
                        logs: { ...prev.logs, ...state },
                    }
                }),
            
            setExecuteState: (state) =>
                set((prev) => ({
                    execute: { ...prev.execute, ...state },
                })),
            
            setTestsState: (state) =>
                set((prev) => {
                    const updated = { ...prev.tests, ...state }
                    // Ensure testRuns array is properly merged if it's being updated
                    if (state.testRuns && Array.isArray(state.testRuns)) {
                        updated.testRuns = state.testRuns
                    }
                    return { tests: updated }
                }),
            
            setTraceFlagsState: (state) =>
                set((prev) => ({
                    traceFlags: { ...prev.traceFlags, ...state },
                })),
            
            resetQueryState: () =>
                set({ query: initialQueryState }),
            
            resetLogsState: () =>
                set({ logs: initialLogsState }),
            
            resetExecuteState: () =>
                set({ execute: initialExecuteState }),
            
            resetTestsState: () =>
                set({ tests: initialTestsState }),
            
            resetTraceFlagsState: () =>
                set({ traceFlags: initialTraceFlagsState }),
            
            resetAll: () =>
                set({
                    query: initialQueryState,
                    logs: initialLogsState,
                    execute: initialExecuteState,
                    tests: initialTestsState,
                    traceFlags: initialTraceFlagsState,
                }),
        }),
        {
            name: 'devconsole-state',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Error rehydrating devconsole store:', error)
                    return
                }
                
                // Clear state on full page refresh
                if (isFullPageRefresh()) {
                    console.log('Full page refresh detected, clearing devconsole state')
                    state?.resetAll()
                    sessionStorage.removeItem('devconsole-state')
                    // Don't set nav flag for refresh - let it stay unset
                } else {
                    // This was a client-side navigation, set flag for next time
                    console.log('Client-side navigation detected, preserving state')
                    sessionStorage.setItem('devconsole_nav_flag', 'true')
                }
            },
        }
    )
)

// Helper to set navigation flag (called by pages on mount)
export const setNavigationFlag = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('devconsole_nav_flag', 'true')
    }
}

