import React from 'react'
import { SoqlRenderer } from './SoqlRenderer'
import { DmlRenderer } from './DmlRenderer'
import { CodeUnitRenderer } from './CodeUnitRenderer'
import { FlowRenderer } from './FlowRenderer'
import { DebugRenderer } from './DebugRenderer'
import { ValidationRenderer } from './ValidationRenderer'
import { CalloutRenderer } from './CalloutRenderer'
import { VfPageRenderer } from './VfPageRenderer'
import { MethodEntryRenderer } from './MethodEntryRenderer'
import { LimitsRenderer } from './LimitsRenderer'
import { StandardRenderer } from './StandardRenderer'
import { DuplicateDetectionRenderer } from './DuplicateDetectionRenderer'
import { UserInfoRenderer } from './UserInfoRenderer'
import { VariableAssignmentRenderer } from './VariableAssignmentRenderer'

export interface LogLine {
    id: string
    time: string
    summary: string
    details?: string
    type: string
    isCollapsible?: boolean
    nestLevel?: number
    isSelected?: boolean
    originalIndex?: number
}

interface LogRendererDispatcherProps {
    line: LogLine
}

export function LogRendererDispatcher({ line }: LogRendererDispatcherProps) {
    switch (line.type) {
        case 'SOQL':
            return <SoqlRenderer line={line} />
        case 'DML':
            return <DmlRenderer line={line} />
        case 'CODE_UNIT':
            return <CodeUnitRenderer line={line} />
        case 'FLOW':
            return <FlowRenderer line={line} />
        case 'DEBUG':
            return <DebugRenderer line={line} />
        case 'VALIDATION':
            return <ValidationRenderer line={line} />
        case 'CALLOUT':
            return <CalloutRenderer line={line} />
        case 'VF_PAGE':
            return <VfPageRenderer line={line} />
        case 'METHOD_ENTRY':
        case 'METHOD_EXIT':
            return <MethodEntryRenderer line={line} />
        case 'LIMITS':
            return <LimitsRenderer line={line} />
        case 'DUPLICATE_DETECTION':
            return <DuplicateDetectionRenderer line={line} />
        case 'USER_INFO':
            return <UserInfoRenderer line={line} />
        case 'VARIABLE_ASSIGNMENT':
            return <VariableAssignmentRenderer line={line} />
        case 'STANDARD':
        default:
            return <StandardRenderer line={line} />
    }
}
