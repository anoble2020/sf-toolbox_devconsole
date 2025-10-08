interface LogEvent {
    id: string
    name: string
    start: number
    end: number
    level: number
    lineNumber: number
}

export function parseLogTimeline(content: string): LogEvent[] {
    const events: LogEvent[] = []
    const stack: LogEvent[] = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
        if (!line.includes('CODE_UNIT_')) return

        const match = line.match(
            /(\d{2}:\d{2}:\d{2}\.\d+)\s*\((\d+)\)\|CODE_UNIT_(STARTED|FINISHED)\|.*?\|([^|]+)(?:\|([^|]+))?/,
        )
        if (!match) return

        const [, timeStr, microsStr, eventType, id, name] = match

        // Parse timestamp
        const [hours, minutes, seconds] = timeStr.split(':')
        const baseTime = new Date(2024, 0, 1)
        baseTime.setHours(parseInt(hours))
        baseTime.setMinutes(parseInt(minutes))
        baseTime.setSeconds(parseFloat(seconds))
        const microseconds = parseInt(microsStr) / 1000 // Convert to milliseconds
        const timestamp = baseTime.getTime() + microseconds

        if (eventType === 'STARTED') {
            const event: LogEvent = {
                id,
                name: name || id,
                start: timestamp,
                end: 0,
                level: stack.length,
                lineNumber: index + 1,
            }
            events.push(event)
            stack.push(event)
        } else if (eventType === 'FINISHED') {
            const matchingEvent = stack.pop()
            if (matchingEvent && matchingEvent.id === id) {
                matchingEvent.end = timestamp
            }
        }
    })

    return events.filter((e) => e.end > 0)
}

export function generateTimelineDiagram(events: LogEvent[]): string {
    const minTime = Math.min(...events.map((e) => e.start))
    const maxTime = Math.max(...events.map((e) => e.end))
    const totalDuration = maxTime - minTime

    let diagram = 'gantt\n'
    diagram += 'dateFormat X\n'
    diagram += 'axisFormat %L ms\n'
    diagram += `section Timeline\n`

    events.forEach((event) => {
        const startOffset = ((event.start - minTime) / totalDuration) * 100
        const duration = ((event.end - event.start) / totalDuration) * 100
        const indent = '  '.repeat(event.level)
        const durationMs = (event.end - event.start).toFixed(2)
        diagram += `${indent}${event.name} :${startOffset}, ${duration}\n`
    })

    return diagram
}
