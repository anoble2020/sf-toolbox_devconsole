import React from 'react'
import { Scale } from 'lucide-react'
import { LogLine } from './LogRendererDispatcher'

interface ValidationRendererProps {
    line: LogLine
}

const IconContainer = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div 
        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0" 
        style={{ backgroundColor: color }}
    >
        <div className="w-4 h-4 flex items-center justify-center">
            {children}
        </div>
    </div>
)

const formatTimestamp = (timestamp: string) => {
    return timestamp.trim()
}

export function ValidationRenderer({ line }: ValidationRendererProps) {
    const content = line.summary
    const [timestamp, ...rest] = content.split(/\s*\|\s*/)

    return (
        <div className="flex flex-col">
            {/* Header row */}
            <div className="flex gap-3">
                <div className="shrink-0">
                    <span className="text-gray-600 min-w-[60px] block">{formatTimestamp(timestamp)}</span>
                </div>
                <div className="flex-1 flex items-start gap-3">
                    <IconContainer color="#9333ea">
                        <Scale className="text-white" />
                    </IconContainer>
                    <span>{rest.join(' | ')}</span>
                </div>
            </div>
            {/* Formula row - aligned with content above */}
            {line.details && (
                <div className="flex gap-3">
                    <div className="shrink-0 min-w-[60px]" /> {/* Spacer for timestamp */}
                    <div className="flex-1 flex gap-3">
                        <div className="w-8" /> {/* Spacer for icon */}
                        <div className="flex-1 font-mono text-sm whitespace-pre-wrap">
                            {line.details}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
