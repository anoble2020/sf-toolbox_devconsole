import React from 'react'
import { Database } from 'lucide-react'
import { LogLine } from './LogRendererDispatcher'

interface DmlRendererProps {
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

export function DmlRenderer({ line }: DmlRendererProps) {
    const content = line.summary
    const [timestamp, ...parts] = content.split(/\s*\|\s*/)
    
    // Check if this line includes row count
    const rowsMatch = parts.join(' | ').match(/Rows: (\d+)$/)
    const rows = rowsMatch ? rowsMatch[1] : null

    // Remove rows from main content if it exists
    const mainContent = rows ? parts.join(' | ').replace(` | Rows: ${rows}`, '') : parts.join(' | ')

    return (
        <div className="flex items-center gap-3 w-full">
            <span className="text-gray-600 min-w-[60px]">{formatTimestamp(timestamp)}</span>
            <IconContainer color="#ee4de1">
                <Database className="text-white" />
            </IconContainer>
            <span className="flex-1">{mainContent}</span>
            {rows && <span className="text-gray-600 whitespace-nowrap">Rows: {rows}</span>}
        </div>
    )
}
