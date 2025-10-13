import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ChevronRight, ChevronDown, Clock, X, Code, Workflow, Globe, Search, Database, Scale, Shield, Expand, Minimize2 } from 'lucide-react'
import * as d3 from 'd3'

interface TraceEvent {
    id: string
    name: string
    type: 'METHOD' | 'TRIGGER' | 'FLOW' | 'CALLOUT' | 'SOQL' | 'DML' | 'VALIDATION' | 'DUPLICATE_DETECTION'
    startTime: number
    endTime: number
    duration: number
    level: number
    children: TraceEvent[]
    lineNumber: number
    timestamp: number
    isMajor: boolean // Indicates if this is a major event that should be shown at top level
}

interface TraceViewerProps {
    content: string
    onClose: () => void
    onEventClick?: (lineNumber: number) => void
}

const getTypeColor = (type: TraceEvent['type']) => {
    switch (type) {
        case 'TRIGGER':
            return 'bg-orange-200 border-orange-400'
        case 'FLOW':
            return 'bg-blue-200 border-blue-400'
        case 'CALLOUT':
            return 'bg-purple-200 border-purple-400'
        case 'SOQL':
            return 'bg-green-200 border-green-400'
        case 'DML':
            return 'bg-pink-200 border-pink-400'
        case 'VALIDATION':
            return 'bg-purple-200 border-purple-400'
        case 'DUPLICATE_DETECTION':
            return 'bg-red-200 border-red-400'
        default:
            return 'bg-gray-200 border-gray-400'
    }
}

const getTypeIcon = (type: TraceEvent['type']) => {
    const iconClass = "w-3 h-3 text-white"
    switch (type) {
        case 'TRIGGER':
            return (
                <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <Code className={iconClass} />
                </div>
            )
        case 'FLOW':
            return (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Workflow className={iconClass} />
                </div>
            )
        case 'CALLOUT':
            return (
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Globe className={iconClass} />
                </div>
            )
        case 'SOQL':
            return (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Search className={iconClass} />
                </div>
            )
        case 'DML':
            return (
                <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                    <Database className={iconClass} />
                </div>
            )
        case 'VALIDATION':
            return (
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <Scale className={iconClass} />
                </div>
            )
        case 'DUPLICATE_DETECTION':
            return (
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Shield className={iconClass} />
                </div>
            )
        default:
            return (
                <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                    <Code className={iconClass} />
                </div>
            )
    }
}

interface TraceEventProps {
    event: TraceEvent
    xScale: (ms: number) => number
    timeStart: number
    labelWidth: number
    maxWidth: number
    onEventClick?: (lineNumber: number) => void
    getEventPosition?: (event: TraceEvent) => { left: number; width: number }
    expandedEvents: Set<string>
    setExpandedEvents: (expanded: Set<string>) => void
}

const TraceEvent = ({ event, xScale, timeStart, labelWidth, maxWidth, onEventClick, expandedEvents, setExpandedEvents }: TraceEventProps) => {
    const isExpanded = expandedEvents.has(event.id)

    // Calculate position and width
    const relativeStart = event.startTime
    const barStart = xScale(relativeStart)
    const barWidth = Math.max(xScale(event.duration), 2) // Ensure minimum width of 2px

    return (
        <div className="relative">
            <div className="flex items-center h-8 group hover:bg-gray-50 dark:hover:bg-gray-800">
                {/* Label section */}
                <div
                    className="flex items-center shrink-0 px-1"
                    style={{
                        width: `${labelWidth}px`,
                        paddingLeft: `${event.level * 16}px`,
                    }}
                >
                    {event.children.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                const newExpanded = new Set(expandedEvents)
                                if (isExpanded) {
                                    newExpanded.delete(event.id)
                                } else {
                                    newExpanded.add(event.id)
                                }
                                setExpandedEvents(newExpanded)
                            }}
                            className="w-4 h-4 flex items-center justify-center shrink-0"
                        >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                    )}
                    <div className="flex items-center gap-1 ml-1">
                        {getTypeIcon(event.type)}
                        <span className="text-xs truncate">{event.name}</span>
                    </div>
                </div>

                {/* Timeline bar section */}
                <div className="flex-1 relative h-full cursor-pointer" onClick={() => onEventClick?.(event.lineNumber)}>
                    <div
                        className={`absolute h-5 rounded border ${getTypeColor(event.type)} top-1/2 -translate-y-1/2`}
                        style={{
                            left: `${barStart}px`,
                            width: `${barWidth}px`,
                        }}
                    >
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] whitespace-nowrap text-gray-800">
                            {event.duration < 1000 ? `${event.duration.toFixed(0)}ms` : `${(event.duration / 1000).toFixed(3)}s`}
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded &&
                event.children.map((child, index) => (
                    <TraceEvent
                        key={child.id}
                        event={child}
                        xScale={xScale}
                        timeStart={timeStart}
                        labelWidth={labelWidth}
                        maxWidth={maxWidth}
                        onEventClick={onEventClick}
                        expandedEvents={expandedEvents}
                        setExpandedEvents={setExpandedEvents}
                    />
                ))}
        </div>
    )
}

const TimeAxis = ({
    scale,
    height,
    ticks,
    formatTime,
    labelWidth,
}: {
    scale: d3.ScaleLinear<number, number>
    height: number
    ticks: number
    formatTime: (t: number) => string
    labelWidth: number
}) => {
    const tickValues = scale.ticks(ticks)

    // Debug logging for TimeAxis
    console.log('=== TimeAxis Debug Info ===')
    console.log('Scale domain:', scale.domain())
    console.log('Scale range:', scale.range())
    console.log('Tick values:', tickValues)
    console.log('Formatted tick values:', tickValues.map(t => formatTime(t)))
    console.log('========================')

    return (
        <div className="relative" style={{ height: `${height}px`, marginLeft: `${labelWidth}px` }}>
            {tickValues.map((tick, i) => (
                <div key={i} className="absolute border-l border-gray-200 h-full" style={{ left: `${scale(tick)}px` }}>
                    <div className="relative -top-4 -translate-x-1/2 text-xs text-gray-500">{formatTime(tick)}</div>
                </div>
            ))}
        </div>
    )
}

export function TraceViewer({ content, onClose, onEventClick }: TraceViewerProps) {
    const events = parseLogEvents(content)
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

    // Filter events based on search query
    const filteredEvents = events.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Expand/collapse all functionality
    const expandAll = () => {
        const allEventIds = new Set<string>()
        const collectEventIds = (eventList: TraceEvent[]) => {
            eventList.forEach(event => {
                if (event.children.length > 0) {
                    allEventIds.add(event.id)
                    collectEventIds(event.children)
                }
            })
        }
        collectEventIds(filteredEvents)
        setExpandedEvents(allEventIds)
    }

    const collapseAll = () => {
        setExpandedEvents(new Set())
    }

    // Guard against empty events array
    if (!events || events.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-lg font-semibold">No trace events found</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Constants for layout
    const LABEL_WIDTH = 300
    const RIGHT_MARGIN = 40
    const PADDING = 32 // Account for modal padding
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.9 - LABEL_WIDTH - RIGHT_MARGIN - PADDING : 1000

    // Group events by execution (events that are close together in time)
    const EXECUTION_GAP_THRESHOLD = 1000 // 1 second gap indicates new execution
    
    const executionGroups: TraceEvent[][] = []
    let currentGroup: TraceEvent[] = []
    
    events.forEach((event, index) => {
        if (index === 0) {
            currentGroup.push(event)
        } else {
            const prevEvent = events[index - 1]
            const timeGap = event.timestamp - (prevEvent.timestamp + prevEvent.duration)
            
            if (timeGap > EXECUTION_GAP_THRESHOLD) {
                // Large gap indicates new execution
                executionGroups.push([...currentGroup])
                currentGroup = [event]
            } else {
                currentGroup.push(event)
            }
        }
    })
    
    if (currentGroup.length > 0) {
        executionGroups.push(currentGroup)
    }
    
    const firstTimestamp = events[0].timestamp
    const lastTimestamp = events.reduce((max, event) => {
        const eventEnd = event.timestamp + event.duration
        return Math.max(max, eventEnd)
    }, firstTimestamp)
    
    // Calculate the actual time span of the entire log execution
    // This should be the difference between the very first and very last timestamps
    const totalDuration = Math.max(lastTimestamp - firstTimestamp, 0.001)

    // Debug logging
    console.log('=== Timeline Debug Info ===')
    console.log('Number of events:', events.length)
    console.log('Number of execution groups:', executionGroups.length)
    console.log('Execution groups:')
    executionGroups.forEach((group, i) => {
        const groupStart = group[0].timestamp
        const groupEnd = group.reduce((max, event) => {
            const eventEnd = event.timestamp + event.duration
            return Math.max(max, eventEnd)
        }, groupStart)
        const groupDuration = groupEnd - groupStart
        console.log(`  Group ${i}: ${group.length} events, duration: ${groupDuration}ms (${(groupDuration/1000).toFixed(3)}s)`)
        group.forEach((event, j) => {
            console.log(`    ${j}: ${event.name} - start: ${event.timestamp}ms, duration: ${event.duration}ms`)
        })
    })
    console.log('First timestamp:', firstTimestamp, 'ms')
    console.log('Last timestamp:', lastTimestamp, 'ms')
    console.log('Timeline duration (actual time span):', totalDuration, 'ms')
    console.log('Timeline duration in seconds:', totalDuration / 1000, 's')
    
    // Show raw nanoseconds for first and last events
    if (events.length > 0) {
        const firstEvent = events[0]
        const lastEvent = events[events.length - 1]
        console.log('First event raw nanoseconds:', firstEvent.timestamp * 1000000)
        console.log('Last event raw nanoseconds:', (lastEvent.timestamp + lastEvent.duration) * 1000000)
        console.log('Raw nanoseconds difference:', ((lastEvent.timestamp + lastEvent.duration) - firstEvent.timestamp) * 1000000)
    }
    console.log('========================')

    // Create scale for x-axis that maps from relative time to pixels
    const xScale = d3.scaleLinear().domain([0, totalDuration]).range([0, maxWidth])

    // Format time values for display
    const formatTime = (t: number) => t < 1000 ? `${t.toFixed(0)}ms` : `${(t / 1000).toFixed(3)}s`

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Execution Timeline ({totalDuration < 1000 ? `${totalDuration.toFixed(0)}ms` : `${(totalDuration / 1000).toFixed(3)}s`} total)
                            </span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={expandAll}
                                className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded flex items-center gap-1"
                                title="Expand All"
                            >
                                <Expand className="w-3 h-3" />
                                Expand All
                            </button>
                            <button
                                onClick={collapseAll}
                                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded flex items-center gap-1"
                                title="Collapse All"
                            >
                                <Minimize2 className="w-3 h-3" />
                                Collapse All
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button onClick={onClose} className="text-gray-500 dark:text-white hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-4 min-h-0 mt-2">
                    <TimeAxis scale={xScale} height={30} ticks={10} formatTime={formatTime} labelWidth={LABEL_WIDTH} />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                        {filteredEvents.map((event, i) => (
                            <TraceEvent
                                key={event.id}
                                event={event}
                                xScale={xScale}
                                timeStart={firstTimestamp}
                                labelWidth={LABEL_WIDTH}
                                maxWidth={maxWidth}
                                onEventClick={onEventClick}
                                expandedEvents={expandedEvents}
                                setExpandedEvents={setExpandedEvents}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function parseTimestamp(timeStr: string, nanosStr: string): number {
    // Use nanoseconds as the primary timing mechanism
    // This gives us precise timing within the same second
    const nanoseconds = parseInt(nanosStr)
    return nanoseconds / 1000000 // Convert nanoseconds to milliseconds
}

    function parseLogEvents(content: string): TraceEvent[] {
        if (!content) {
            console.warn('No content provided to parseLogEvents')
            return []
        }

        const events: TraceEvent[] = []
        const stack: TraceEvent[] = []
        const lines = content.split('\n')

        // Find the first timestamp to use as reference
        const firstMatch = lines.find(line => {
            const match = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)/)
            return match !== null
        })

        if (!firstMatch) {
            console.warn('No valid timestamps found in log content')
            return []
        }

        const firstTimestampMatch = firstMatch.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)/)
        const firstTimestamp = firstTimestampMatch 
            ? parseTimestamp(firstTimestampMatch[1], firstTimestampMatch[2])
            : 0

        console.log('=== Parse Debug Info ===')
        console.log('First timestamp found:', firstTimestampMatch?.[1], firstTimestampMatch?.[2])
        console.log('First timestamp parsed:', firstTimestamp, 'ms (from', firstTimestampMatch?.[2], 'nanoseconds)')
        console.log('========================')

        lines.forEach((line, lineNumber) => {
            const timestamp = parseTimestampFromLine(line)
            if (timestamp === null) return

            const relativeTime = timestamp - firstTimestamp

            // Parse different event types
            const codeUnitMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|CODE_UNIT_(STARTED|FINISHED)\|(\[EXTERNAL\])?(\|[^|]+\|[^|]+)?/)
            const methodMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|METHOD_(ENTRY|EXIT)\|\[(\d+)\]\|(.*)/)
            const soqlMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|SOQL_EXECUTE_(BEGIN|END)\|\[(\d+)\](.*)/)
            const dmlMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|DML_(BEGIN|END)\|\[(\d+)\](.*)/)
            const validationMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|VALIDATION_RULE\|([^|]+)\|(.*)/)
            const duplicateMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|DUPLICATE_DETECTION_BEGIN/)

            if (codeUnitMatch) {
                const [, , , eventType, , rest] = codeUnitMatch
                const [, id, name] = (rest || '||').split('|')

                if (eventType === 'STARTED') {
                    const event: TraceEvent = {
                        id: `${id?.trim() || 'codeunit'}_${lineNumber}_${relativeTime}`,
                        name: cleanEventName(name?.trim() || 'Unknown Code Unit'),
                        type: determineEventType(name || id || ''),
                        startTime: relativeTime,
                        endTime: 0,
                        duration: 0,
                        level: stack.length,
                        children: [],
                        lineNumber,
                        timestamp: relativeTime,
                        isMajor: true, // Code units are major events
                    }

                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push(event)
                    } else {
                        events.push(event)
                    }

                    stack.push(event)
                } else if (eventType === 'FINISHED' && stack.length > 0) {
                    const currentEvent = stack.pop()
                    if (currentEvent && currentEvent.type === determineEventType(name || id || '')) {
                        currentEvent.endTime = relativeTime
                        currentEvent.duration = currentEvent.endTime - currentEvent.startTime
                    }
                }
            } else if (methodMatch) {
                const [, , , eventType, lineNum, methodInfo] = methodMatch

                if (eventType === 'ENTRY') {
                    const event: TraceEvent = {
                        id: `method_${lineNum}_${lineNumber}_${relativeTime}`,
                        name: cleanEventName(methodInfo?.trim() || 'Unknown Method'),
                        type: 'METHOD',
                        startTime: relativeTime,
                        endTime: 0,
                        duration: 0,
                        level: stack.length,
                        children: [],
                        lineNumber,
                        timestamp: relativeTime,
                        isMajor: false, // Methods are nested under code units
                    }

                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push(event)
                    } else {
                        events.push(event)
                    }

                    stack.push(event)
                } else if (eventType === 'EXIT' && stack.length > 0) {
                    const currentEvent = stack.pop()
                    if (currentEvent && currentEvent.type === 'METHOD') {
                        currentEvent.endTime = relativeTime
                        currentEvent.duration = currentEvent.endTime - currentEvent.startTime
                    }
                }
            } else if (soqlMatch) {
                const [, , , eventType, lineNum, queryInfo] = soqlMatch

                if (eventType === 'BEGIN') {
                    const event: TraceEvent = {
                        id: `soql_${lineNum}_${lineNumber}_${relativeTime}`,
                        name: `SOQL [${lineNum}]`,
                        type: 'SOQL',
                        startTime: relativeTime,
                        endTime: 0,
                        duration: 0,
                        level: stack.length,
                        children: [],
                        lineNumber,
                        timestamp: relativeTime,
                        isMajor: false, // SOQL is nested under methods/code units
                    }

                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push(event)
                    } else {
                        events.push(event)
                    }

                    stack.push(event)
                } else if (eventType === 'END' && stack.length > 0) {
                    const currentEvent = stack.pop()
                    if (currentEvent && currentEvent.type === 'SOQL') {
                        currentEvent.endTime = relativeTime
                        currentEvent.duration = currentEvent.endTime - currentEvent.startTime
                    }
                }
            } else if (dmlMatch) {
                const [, , , eventType, lineNum, dmlInfo] = dmlMatch

                if (eventType === 'BEGIN') {
                    const event: TraceEvent = {
                        id: `dml_${lineNum}_${lineNumber}_${relativeTime}`,
                        name: `DML [${lineNum}]`,
                        type: 'DML',
                        startTime: relativeTime,
                        endTime: 0,
                        duration: 0,
                        level: stack.length,
                        children: [],
                        lineNumber,
                        timestamp: relativeTime,
                        isMajor: false, // DML is nested under methods/code units
                    }

                    if (stack.length > 0) {
                        stack[stack.length - 1].children.push(event)
                    } else {
                        events.push(event)
                    }

                    stack.push(event)
                } else if (eventType === 'END' && stack.length > 0) {
                    const currentEvent = stack.pop()
                    if (currentEvent && currentEvent.type === 'DML') {
                        currentEvent.endTime = relativeTime
                        currentEvent.duration = currentEvent.endTime - currentEvent.startTime
                    }
                }
            } else if (validationMatch) {
                const [, , , ruleId, ruleName] = validationMatch

                const event: TraceEvent = {
                    id: `validation_${ruleId}_${lineNumber}_${relativeTime}`,
                    name: `Validation: ${cleanEventName(ruleName?.trim() || 'Unknown Rule')}`,
                    type: 'VALIDATION',
                    startTime: relativeTime,
                    endTime: relativeTime,
                    duration: 0, // Validation rules are typically instantaneous
                    level: stack.length,
                    children: [],
                    lineNumber,
                    timestamp: relativeTime,
                    isMajor: false, // Validations are nested
                }

                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(event)
                } else {
                    events.push(event)
                }
            } else if (duplicateMatch) {
                const event: TraceEvent = {
                    id: `duplicate_${lineNumber}_${relativeTime}`,
                    name: 'Duplicate Detection',
                    type: 'DUPLICATE_DETECTION',
                    startTime: relativeTime,
                    endTime: relativeTime,
                    duration: 0, // Duplicate detection is typically instantaneous
                    level: stack.length,
                    children: [],
                    lineNumber,
                    timestamp: relativeTime,
                    isMajor: false, // Duplicate detection is nested
                }

                if (stack.length > 0) {
                    stack[stack.length - 1].children.push(event)
                } else {
                    events.push(event)
                }
            }
        })

        // Filter and return only major events (top-level events)
        return events.filter(event => 
            event.isMajor && 
            event.duration > 0 && 
            event.startTime !== undefined && 
            event.endTime !== undefined
        )
    }

    function parseTimestampFromLine(line: string): number | null {
        const match = line.match(/(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)/)
        if (!match) return null

        const [, timeStr, microsStr] = match
        return parseTimestamp(timeStr, microsStr)
    }

function determineEventType(name: string): TraceEvent['type'] {
    if (name.toLowerCase().includes('trigger')) return 'TRIGGER'
    if (name.toLowerCase().includes('flow')) return 'FLOW'
    if (name.toLowerCase().includes('callout')) return 'CALLOUT'
    return 'METHOD'
}

function cleanEventName(name: string): string {
    // Remove Salesforce IDs like "01pgL000006PQ3t|" from the beginning
    const idPattern = /^[0-9A-Za-z]{15,18}\|/
    let cleaned = name.replace(idPattern, '')
    
    // Remove leading pipes and clean up formatting
    cleaned = cleaned.replace(/^\|+/, '').trim()
    
    // If the name is empty or just pipes, return a default
    if (!cleaned || cleaned === '|') {
        return 'Unknown Event'
    }
    
    return cleaned
}
