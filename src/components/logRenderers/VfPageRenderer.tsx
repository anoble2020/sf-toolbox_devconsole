import React from 'react'
import { FileText } from 'lucide-react'
import { LogLine } from './LogRendererDispatcher'

interface VfPageRendererProps {
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

export function VfPageRenderer({ line }: VfPageRendererProps) {
    const content = line.summary
    const [timestamp, ...rest] = content.split(/\s*\|\s*/)

    return (
        <div className="flex items-center gap-3">
            <span className="text-gray-600 min-w-[60px]">{formatTimestamp(timestamp)}</span>
            <IconContainer color="#8b5cf6">
                <FileText className="text-white" />
            </IconContainer>
            <span>{rest.join(' | ')}</span>
        </div>
    )
}
