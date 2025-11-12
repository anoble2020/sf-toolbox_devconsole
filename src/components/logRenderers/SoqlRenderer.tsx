import React from 'react'
import { Search } from 'lucide-react'
import { LogLine } from './LogRendererDispatcher'

interface SoqlRendererProps {
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

const renderSqlWithBoldKeywords = (text: string) => {
    // Split on markdown-style bold markers
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the markers and render bold
            return (
                <span key={index} className="font-bold">
                    {part.slice(2, -2)}
                </span>
            )
        }
        return <span key={index}>{part}</span>
    })
}

const formatTimestamp = (timestamp: string) => {
    return timestamp.trim()
}

export function SoqlRenderer({ line }: SoqlRendererProps) {
    const content = line.summary
    const [timestamp, ...rest] = content.split(/\s*\|\s*/)
    const mainContent = rest.join(' | ')
    const statsMatch = mainContent.match(/\| (Aggregations: \d+ \| Rows: \d+)$/)
    const stats = statsMatch ? statsMatch[1] : ''
    const query = statsMatch ? mainContent.replace(statsMatch[0], '') : mainContent

    return (
        <div className="flex items-center gap-3 w-full">
            <span className="text-gray-600 min-w-[60px]">{formatTimestamp(timestamp)}</span>
            <IconContainer color="#484b6a">
                <Search className="text-white" />
            </IconContainer>
            <span className="flex-1">{renderSqlWithBoldKeywords(query)}</span>
            {stats && <span className="text-gray-600 whitespace-nowrap">{stats}</span>}
        </div>
    )
}
