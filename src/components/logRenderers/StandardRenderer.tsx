import React from 'react'
import { LogLine } from './LogRendererDispatcher'

interface StandardRendererProps {
    line: LogLine
}

export function StandardRenderer({ line }: StandardRendererProps) {
    return <span>{line.summary}</span>
}
