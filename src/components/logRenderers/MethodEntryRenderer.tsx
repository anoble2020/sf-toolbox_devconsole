import React from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { LogLine } from './LogRendererDispatcher'

interface MethodEntryRendererProps {
    line: LogLine
}

const IconContainer = ({ children, color }: { children: React.ReactNode; color: string }) => (
    <div 
        className="flex items-center justify-center w-6 h-6 rounded-full shrink-0" 
        style={{ backgroundColor: color }}
    >
        <div className="w-3 h-3 flex items-center justify-center">
            {children}
        </div>
    </div>
)

const formatTimestamp = (timestamp: string) => {
    return timestamp.trim()
}

export function MethodEntryRenderer({ line }: MethodEntryRendererProps) {
    const content = line.summary
    const [timestamp, ...rest] = content.split(/\s*\|\s*/)
    const isEntry = line.type === 'METHOD_ENTRY'
    const iconColor = isEntry ? '#f59e0b' : '#6b7280'

    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-600 min-w-[60px]">{formatTimestamp(timestamp)}</span>
            <IconContainer color={iconColor}>
                {isEntry ? (
                    <ArrowRight className="text-white" />
                ) : (
                    <ArrowLeft className="text-white" />
                )}
            </IconContainer>
            <span>{rest.join(' | ')}</span>
        </div>
    )
}
