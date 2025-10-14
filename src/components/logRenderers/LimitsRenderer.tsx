import React from 'react'
import { LogLine } from './LogRendererDispatcher'

interface LimitsRendererProps {
    line: LogLine
}

const formatTimestamp = (timestamp: string) => {
    return timestamp.trim()
}

export function LimitsRenderer({ line }: LimitsRendererProps) {
    const content = line.summary
    const [timestamp, ...rest] = content.split(/\s*\|\s*/)

    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-600 min-w-[60px]">{formatTimestamp(timestamp)}</span>
            <span className="flex-1">{rest.join(' | ')}</span>
        </div>
    )
}
