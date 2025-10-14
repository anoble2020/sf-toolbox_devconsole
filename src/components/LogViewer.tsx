'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, LineChart, MousePointerClick, Loader2, Filter, Database, Code, Bug, Workflow, Scale, Globe, FileText, ArrowRight, ArrowLeft, Shield, User, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import { TraceViewer } from '@/components/TraceViewer'
import { LogReplay } from '@/components/LogReplay'
import { formatLogs } from '@/lib/logFormatter'
import { LogViewerProps, TabState } from '@/lib/types'
import { X } from 'lucide-react'
import { formatLogTime } from '@/lib/utils'
import { LogRendererDispatcher } from '@/components/logRenderers'

interface CollapsibleLine {
    id: string
    time: string
    summary: string
    details?: string
    type: 'SOQL' | 'JSON' | 'STANDARD' | 'LIMITS' | 'CODE_UNIT' | 'FLOW' | 'DEBUG' | 'DML' | 'VALIDATION' | 'CALLOUT' | 'VF_PAGE' | 'METHOD_ENTRY' | 'METHOD_EXIT' | 'DUPLICATE_DETECTION' | 'USER_INFO' | 'VARIABLE_ASSIGNMENT'
    isCollapsible?: boolean
    nestLevel?: number
    isSelected?: boolean
    originalIndex?: number
}

const LINE_TYPES = [
    { value: 'SOQL', label: 'SOQL Queries', icon: Search, color: '#484b6a' },
    { value: 'DML', label: 'DML Operations', icon: Database, color: '#ee4de1' },
    { value: 'DEBUG', label: 'Debug Statements', icon: Bug, color: '#f1ad48' },
    { value: 'LIMITS', label: 'Governor Limits', icon: null, color: '#E8EEFF' },
    { value: 'CODE_UNIT', label: 'Code Units', icon: Code, color: '#94e591' },
    { value: 'FLOW', label: 'Flow Executions', icon: Workflow, color: '#3a49ee' },
    { value: 'VALIDATION', label: 'Validation Rules', icon: Scale, color: '#9333ea' },
    { value: 'CALLOUT', label: 'Callouts', icon: Globe, color: '#10b981' },
    { value: 'VF_PAGE', label: 'Visualforce Pages', icon: FileText, color: '#8b5cf6' },
    { value: 'METHOD_ENTRY', label: 'Method Entry', icon: ArrowRight, color: '#f59e0b' },
    { value: 'METHOD_EXIT', label: 'Method Exit', icon: ArrowLeft, color: '#6b7280' },
    { value: 'DUPLICATE_DETECTION', label: 'Duplicate Detection', icon: Shield, color: '#dc2626' },
    { value: 'USER_INFO', label: 'User Info', icon: User, color: '#059669' },
    { value: 'VARIABLE_ASSIGNMENT', label: 'Variable Assignment', icon: Hash, color: '#7c3aed' },
    { value: 'JSON', label: 'JSON Operations', icon: null, color: null },
    { value: 'STANDARD', label: 'Standard Logs', icon: null, color: null }
] as const


const renderContent = (line: CollapsibleLine) => {
    return <LogRendererDispatcher line={line} />
}

export function LogViewer({ logs = [], isLoading, onCloseLog, tabStates, setTabStates, activeLogId }: LogViewerProps) {
    const [activeTab, setActiveTab] = useState<string>(activeLogId || '')
    const logContentRef = useRef<HTMLDivElement>(null)
    
    // Store state for each tab in a Record
    const [filteredLines, setFilteredLines] = useState<Record<string, CollapsibleLine[]>>({})

    // Update active tab when activeLogId changes
    useEffect(() => {
        if (activeLogId) {
            setActiveTab(activeLogId)
            // Initialize tab state if it doesn't exist
            if (!tabStates[activeLogId]) {
                setTabStates(prev => ({
                    ...prev,
                    [activeLogId]: {
                        prettyMode: false,
                        debugOnly: false,
                        searchQuery: '',
                        showTimeline: false,
                        showReplay: false,
                        selectedLine: null,
                        expandedLines: new Set(),
                        selectedLineContent: {
                            id: '',
                            pretty: null,
                            raw: null
                        },
                        enabledLineTypes: new Set(LINE_TYPES.map(type => type.value))
                    }
                }))
            }
        }
    }, [activeLogId, setTabStates])
    
    // Initialize tab state when a new tab is added
    useEffect(() => {
        logs.forEach(log => {
            if (!tabStates[log.id]) {
                setTabStates((prev: Record<string, TabState>) => ({
                    ...prev,
                    [log.id]: {
                        prettyMode: false,
                        debugOnly: false,
                        searchQuery: '',
                        showTimeline: false,
                        showReplay: false,
                        selectedLine: null,
                        expandedLines: new Set(),
                        selectedLineContent: {
                            id: '',
                            pretty: null,
                            raw: null
                        },
                        enabledLineTypes: new Set(LINE_TYPES.map(type => type.value))
                    }
                }))
            }
        })
    }, [logs])

    // Set initial active tab
    useEffect(() => {
        if (!activeTab && logs.length > 0) {
            setActiveTab(logs[0].id)
        }
    }, [logs])

    // Get current tab's state
    const currentTabState = tabStates[activeTab] || {
        prettyMode: false,
        debugOnly: false,
        searchQuery: '',
        showTimeline: false,
        showReplay: false,
        selectedLine: null,
        expandedLines: new Set(),
        selectedLineContent: { id: '', pretty: null, raw: null },
        enabledLineTypes: new Set(LINE_TYPES.map(type => type.value))
    }

    // Update state for current tab
    const updateTabState = (updates: Partial<TabState>) => {
        setTabStates((prev: Record<string, TabState>) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                ...updates
            }
        }))
    }

    // Filter lines based on current tab's state
    useEffect(() => {
        const newFilteredLines: Record<string, CollapsibleLine[]> = {}
        
        logs.forEach(log => {
            const state = tabStates[log.id]
            if (!state || !log.content) {
                newFilteredLines[log.id] = []
                return
            }

            const allLines = log.content.split('\n')
            let processedLines = allLines.map((line: string, index: number) => ({
                line,
                originalIndex: index,
            }))

            if (state.debugOnly) {
                processedLines = processedLines.filter(({ line }: { line: string }) => line.includes('USER_DEBUG'))
            }

            if (state.searchQuery) {
                processedLines = processedLines.filter(({ line }: { line: string }) => 
                    line.toLowerCase().includes(state.searchQuery.toLowerCase())
                )
            }

            if (state.prettyMode) {
                const formattedLines = formatLogs(allLines)
                let filteredFormatted = formattedLines
                
                // Filter by enabled line types
                const enabledTypes = state.enabledLineTypes || new Set(LINE_TYPES.map(type => type.value))
                filteredFormatted = filteredFormatted.filter((line) => 
                    enabledTypes.has(line.type)
                )
                
                if (state.debugOnly) {
                    filteredFormatted = filteredFormatted.filter((line) => 
                        line.summary.includes('DEBUG')
                    )
                }
                
                if (state.searchQuery) {
                    filteredFormatted = filteredFormatted.filter((line) =>
                        line.summary.toLowerCase().includes(state.searchQuery.toLowerCase())
                    )
                }

                newFilteredLines[log.id] = filteredFormatted.map((line) => ({
                    ...line,
                    type: line.type as CollapsibleLine['type'],
                    isSelected: state.selectedLineContent?.id === `line_${line.originalIndex}`,
                }))
            } else {
                newFilteredLines[log.id] = processedLines.map(({ line, originalIndex }: { line: string, originalIndex: number }) => ({
                    id: `line_${originalIndex}`,
                    time: '',
                    summary: line,
                    type: 'STANDARD',
                    isCollapsible: false,
                    originalIndex,
                    isSelected: state.selectedLineContent?.id === `line_${originalIndex}`,
                }))
            }
        })

        setFilteredLines(newFilteredLines)
    }, [logs, tabStates])

    const toggleLine = (lineId: string) => {
        const newExpandedLines = new Set<string>(currentTabState.expandedLines)
        if (newExpandedLines.has(lineId)) {
            newExpandedLines.delete(lineId)
        } else {
            newExpandedLines.add(lineId)
        }
        updateTabState({ expandedLines: newExpandedLines })
    }

    const handleLineClick = (line: CollapsibleLine, isExpandToggle: boolean = false) => {
        if (isExpandToggle) {
            toggleLine(line.id)
            return
        }

        // Debug logging
        console.log('Clicked line details:', {
            id: line.id,
            originalIndex: line.originalIndex,
            currentSelectedId: currentTabState.selectedLineContent?.id,
        })

        // Handle deselection
        if (currentTabState.selectedLineContent?.id === `line_${line.originalIndex}`) {
            updateTabState({ selectedLineContent: { id: '', raw: null, pretty: null } })
            return
        }
        // Get raw line using the original index
        const rawLine = logs.find(log => log.id === activeTab)?.content?.split('\n')?.[line.originalIndex ?? 0] || null

        const newSelectedContent = {
            id: `line_${line.originalIndex}`,
            raw: rawLine,
            pretty: currentTabState.prettyMode ? `${line.time}|${line.summary}` : null,
        }

        console.log('Setting selected line content:', newSelectedContent)
        updateTabState({ selectedLineContent: newSelectedContent })
    }

    const handleCloseTab = (e: React.MouseEvent, logId: string) => {
        e.preventDefault()
        e.stopPropagation()
        
        // If we're closing the active tab, switch to another tab
        if (activeTab === logId) {
            const remainingLogs = logs.filter(log => log.id !== logId)
            if (remainingLogs.length > 0) {
                setActiveTab(remainingLogs[0].id)
            }
        }
        
        onCloseLog?.(logId)
    }

    const renderLine = (line: CollapsibleLine) => {
        const isSelected = currentTabState.selectedLineContent?.id === `line_${line.originalIndex}`

        const baseClasses = `
            py-1
            ${line.type === 'LIMITS' ? 'cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white' : ''}
            ${isSelected ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
        `

        if (!currentTabState.prettyMode || !line.isCollapsible) {
            return (
                <div
                    className={baseClasses}
                    onClick={() => line.type !== 'LIMITS' && handleLineClick(line)}
                >
                    <div className="px-2">{renderContent(line)}</div>
                </div>
            )
        }

        const isExpanded = currentTabState.expandedLines.has(line.id)

        return (
            <div
                className={baseClasses}
                onClick={() => line.type !== 'LIMITS' && handleLineClick(line)}
            >
                <div className="flex items-center gap-2 px-2">{renderContent(line)}</div>
                {isExpanded && line.details && (
                    <div className="pl-8 py-2 bg-gray-50 dark:bg-gray-800 font-mono text-sm w-full whitespace-pre">{line.details}</div>
                )}
            </div>
        )
    }

    const handleEventClick = (lineNumber: number) => {
        updateTabState({ showTimeline: false })
        // Scroll to the line in the log
        if (logContentRef.current) {
            const lineElement = logContentRef.current.querySelector(`[data-line="${lineNumber}"]`)
            lineElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col h-full justify-center items-center">
                <MousePointerClick className="w-4 h-4 text-gray-500 dark:text-white animate-pulse" />
                <span className="text-sm text-gray-500 dark:text-white">
                    No logs to display
                </span>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <Tabs 
                value={activeTab}
                onValueChange={(value) => setActiveTab(value)}
            >
                {/* Sticky Controls bar - full width with proper spacing */}
                <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-2">
                    <div className="flex items-center justify-between w-full">
                        {/* Left side with search */}
                        <div className="flex items-center gap-2 flex-1">
                            <Search className="w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Filter log lines..."
                                value={currentTabState.searchQuery}
                                onChange={(e) => updateTabState({ searchQuery: e.target.value })}
                                className="w-64"
                            />
                            <span className="text-sm text-gray-500">
                                Showing {filteredLines[activeTab]?.length || 0} lines
                            </span>
                        </div>

                        {/* Right side with controls */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="pretty-mode"
                                    checked={currentTabState.prettyMode}
                                    onCheckedChange={(checked) => updateTabState({ prettyMode: checked })}
                                />
                                <Label htmlFor="pretty-mode" className="text-sm text-gray-600 dark:text-white">
                                    {currentTabState.prettyMode ? 'Pretty' : 'Raw'}
                                </Label>
                                {currentTabState.prettyMode && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Filter className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64">
                                            {/* Select All / Clear All options */}
                                            <div className="px-2 py-1.5 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs"
                                                        onClick={() => {
                                                            const allTypes = new Set(LINE_TYPES.map(type => type.value))
                                                            updateTabState({ enabledLineTypes: allTypes })
                                                        }}
                                                    >
                                                        Select All
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 px-2 text-xs"
                                                        onClick={() => {
                                                            updateTabState({ enabledLineTypes: new Set() })
                                                        }}
                                                    >
                                                        Clear All
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                            {/* Individual line type filters */}
                                            {LINE_TYPES.map((lineType) => {
                                                const enabledTypes = currentTabState.enabledLineTypes || new Set(LINE_TYPES.map(type => type.value))
                                                const IconComponent = lineType.icon
                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={lineType.value}
                                                        checked={enabledTypes.has(lineType.value)}
                                                        onCheckedChange={(checked) => {
                                                            const newEnabledTypes = new Set(enabledTypes)
                                                            if (checked) {
                                                                newEnabledTypes.add(lineType.value)
                                                            } else {
                                                                newEnabledTypes.delete(lineType.value)
                                                            }
                                                            updateTabState({ enabledLineTypes: newEnabledTypes })
                                                        }}
                                                        onSelect={(e) => e.preventDefault()}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {lineType.color ? (
                                                                <div 
                                                                    className="flex items-center justify-center w-6 h-6 rounded-full shrink-0" 
                                                                    style={{ backgroundColor: lineType.color }}
                                                                >
                                                                    {IconComponent && <IconComponent className="w-3 h-3 text-white" />}
                                                                </div>
                                                            ) : (
                                                                <div className="w-6 h-6" />
                                                            )}
                                                            <span>{lineType.label}</span>
                                                        </div>
                                                    </DropdownMenuCheckboxItem>
                                                )
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="debug-mode"
                                    checked={currentTabState.debugOnly}
                                    onCheckedChange={(checked) => updateTabState({ debugOnly: checked })}
                                />
                                <Label htmlFor="debug-mode" className="text-sm text-gray-600 dark:text-white">
                                    Debug Only
                                </Label>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => updateTabState({ showTimeline: !currentTabState.showTimeline })}>
                                <LineChart className="w-4 h-4 mr-1" />
                                {currentTabState.showTimeline ? 'Hide Timeline' : 'Timeline'}
                            </Button>
                            <Button variant="outline" disabled size="sm" onClick={() => updateTabState({ showReplay: !currentTabState.showReplay })}>
                                {currentTabState.showReplay ? 'Hide Replay' : 'Replay'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sticky Tabs bar with close button */}
                <div className="sticky z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" style={{ top: '53px' }}>
                    <TabsList className="w-full justify-start px-2">
                        {logs.map((log) => (
                            <TabsTrigger 
                                key={log.id} 
                                value={log.id} 
                                className="group relative pr-6 data-[state=inactive]:border data-[state=inactive]:border-gray-300 dark:data-[state=inactive]:border-gray-800"
                            >
                                {formatLogTime(log.time)} ({log.duration})
                                <div
                                    onClick={(e) => handleCloseTab(e, log.id)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 
                                             hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer
                                             opacity-0 group-hover:opacity-100 transition-opacity"
                                    role="button"
                                    aria-label={`Close ${formatLogTime(log.time)} tab`}
                                >
                                    <X className="h-3 w-3" />
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Tab content */}
                {logs.map((log) => (
                    <TabsContent
                        key={log.id}
                        value={log.id}
                        className="flex-1 overflow-hidden relative"
                    >
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-50">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                            </div>
                        )}

                        {currentTabState.showTimeline && (
                            <div className="flex-none border-b border-gray-200 dark:border-gray-800">
                                <TraceViewer
                                    content={log.content}
                                    onClose={() => updateTabState({ showTimeline: false })}
                                    onEventClick={handleEventClick}
                                />
                            </div>
                        )}

                        {currentTabState.showReplay && (
                            <div className="flex-none border-b border-gray-200 dark:border-gray-800">
                                <LogReplay 
                                    content={log.content} 
                                    onLineSelect={(line) => updateTabState({ selectedLine: line })} 
                                />
                            </div>
                        )}

                        <div className="flex-1 overflow-auto font-mono text-sm" ref={logContentRef}>
                            {filteredLines[log.id]?.map((line, index) => (
                                <div key={index} data-line={line.originalIndex}>{renderLine(line)}</div>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
