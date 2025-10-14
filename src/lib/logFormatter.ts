interface LimitUsage {
    namespace: string
    metrics: {
        [key: string]: {
            used: number
            total: number
        }
    }
}

interface FormattedLine {
    id: string
    time: string
    summary: string
    details?: string
    type: string
    isCollapsible?: boolean
    suffix?: string
    nestLevel?: number
    unitId?: string
    isUnitStart?: boolean
    isUnitEnd?: boolean
    originalIndex?: number
}

interface NamespaceLimits {
    [namespace: string]: {
        [key: string]: {
            used: number
            total: number
        }
    }
}

function tryFormatJson(str: string): {
    formatted: string
    isJson: boolean
    preview: string
} {
    try {
        const jsonStart = str.indexOf('[') || str.indexOf('{')
        if (jsonStart === -1) return { formatted: str, isJson: false, preview: '' }

        const jsonStr = str.slice(jsonStart)
        const parsed = JSON.parse(jsonStr)
        const formatted = JSON.stringify(parsed, null, 2)

        const preview =
            JSON.stringify(parsed)
                .replace(/^\{|\}$/g, '')
                .split(',')
                .slice(0, 2)
                .join(', ') + (Object.keys(parsed).length > 2 ? ' ...' : '')

        return {
            formatted,
            isJson: true,
            preview,
        }
    } catch (e) {
        return { formatted: str, isJson: false, preview: '' }
    }
}

export function formatLogLine(line: string, originalIndex: number, allLines: string[]): FormattedLine | null {
    const baseId = `line_${originalIndex}`

    const timeMatch = line.match(/(\d{2}:\d{2}:\d{2})\.(\d+)\s*\(\d+\)\|/)
    if (!timeMatch) {
        return {
            id: baseId,
            time: '',
            summary: line,
            type: 'STANDARD',
            originalIndex,
        }
    }

    const [fullMatch, time] = timeMatch
    let cleanLine = line.replace(fullMatch, `${time}|`)

    if (!cleanLine.includes('USER_DEBUG')) {
        cleanLine = cleanLine.replace(/\[EXTERNAL\]\|/, '')
    }

    if (cleanLine.includes('USER_DEBUG')) {
        const debugMatch = cleanLine.match(/USER_DEBUG\|\[(\d+)\]\|(DEBUG|INFO|WARN|ERROR)\|(.*)/)
        if (debugMatch) {
            const [_, lineNum, level, message] = debugMatch
            const { formatted, isJson, preview } = tryFormatJson(message)

            if (isJson) {
                return {
                    id: baseId,
                    time,
                    summary: `${time} | DEBUG [${lineNum}] | {${preview}}`,
                    details: formatted,
                    type: 'DEBUG',
                    isCollapsible: true,
                    originalIndex,
                }
            }

            if (message.length > 200) {
                return {
                    id: baseId,
                    time,
                    summary: `${time} | DEBUG [${lineNum}] | ${message.substring(0, 200)}...`,
                    details: message,
                    type: 'DEBUG',
                    isCollapsible: true,
                    originalIndex,
                }
            }

            return {
                id: baseId,
                time,
                summary: `${time} | DEBUG [${lineNum}] | ${message}`,
                type: 'DEBUG',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    if (cleanLine.includes('CODE_UNIT_')) {
        // Skip TRIGGERS line
        if (cleanLine.includes('|TRIGGERS') || cleanLine.includes('|Flow:')) {
            return null
        }

        const isStart = cleanLine.includes('CODE_UNIT_STARTED')
        
        // More flexible pattern to match any CODE_UNIT line
        const codeUnitMatch = cleanLine.match(/CODE_UNIT_(STARTED|FINISHED)\|(?:\[EXTERNAL\]\|)?([^|]+)(?:\|([^|]+))?/)
        
        if (codeUnitMatch) {
            const [, eventType, id, name] = codeUnitMatch
            const displayName = name || id
            
            console.log('CODE_UNIT matched:', { eventType, id, name, displayName, isStart })
            
            return {
                id: baseId,
                time,
                summary: `${time} | ${isStart ? 'CODE UNIT START' : 'CODE UNIT FINISH'} | ${displayName}`,
                type: 'CODE_UNIT',
                isCollapsible: false,
                originalIndex,
            }
        } else {
            console.log('CODE_UNIT line did not match pattern:', cleanLine)
        }
    } else if (cleanLine.includes('FLOW_')) {
        // Handle Flow start/finish lines
        const isStart = cleanLine.includes('FLOW_START_INTERVIEW_BEGIN')
        const flowMatch = cleanLine.match(/FLOW_(?:START_INTERVIEW_BEGIN|INTERVIEW_FINISHED)\|[^|]+\|([^|]+)/)

        if (flowMatch) {
            const [, flowName] = flowMatch
            return {
                id: baseId,
                time,
                summary: `${time} | ${isStart ? 'FLOW START' : 'FLOW FINISH'} | ${flowName}`,
                type: 'FLOW',
                isCollapsible: false,
                originalIndex,
            }
        }
    } else if (cleanLine.includes('DML_')) {
        const isDmlBegin = cleanLine.includes('DML_BEGIN')
        if (isDmlBegin) {
            const dmlMatch = cleanLine.match(/DML_BEGIN\|\[(\d+)\]\|Op:(\w+)\|Type:(\w+)\|Rows:(\d+)/)
            if (dmlMatch) {
                const [_, lineNum, operation, objectType, rows] = dmlMatch
                return {
                    id: baseId,
                    time,
                    summary: `${time} | DML BEGIN | Object: ${objectType} | ${operation} | Rows: ${rows}`,
                    type: 'DML',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        } else {
            const dmlEndMatch = cleanLine.match(/DML_END\|\[(\d+)\]/)
            if (dmlEndMatch) {
                return {
                    id: baseId,
                    time,
                    summary: `${time} | DML END`,
                    type: 'DML',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        }
    } else if (cleanLine.includes('VALIDATION_RULE')) {
        const ruleMatch = cleanLine.match(/VALIDATION_RULE\|([^|]+)\|(.+)$/)
        if (ruleMatch) {
            const [_, ruleId, ruleName] = ruleMatch
            
            // Look ahead for formula and result
            let formula = []
            let result = 'UNKNOWN'
            let i = 1
            let foundFormula = false
            
            while (i < 20 && originalIndex + i < allLines.length) { // Increased max lines to check
                const nextLine = allLines[originalIndex + i]
                
                if (nextLine.includes('VALIDATION_FORMULA')) {
                    foundFormula = true
                    formula.push(nextLine.split('|')[2])
                } else if (foundFormula && (nextLine.includes('VALIDATION_PASS') || nextLine.includes('VALIDATION_FAIL'))) {
                    result = nextLine.includes('VALIDATION_PASS') ? 'PASS' : 'FAIL'
                    break
                } else if (foundFormula && !nextLine.includes('CODE_UNIT')) {
                    // Continue collecting formula lines until we hit a result or code unit
                    formula.push(nextLine)
                }
                i++
            }

            const fullFormula = formula.join('\n')

            return {
                id: baseId,
                time,
                summary: `${time} | VALIDATION RULE | ${ruleName} | ${result}`,
                details: fullFormula,
                type: 'VALIDATION',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Skip validation formula and pass/fail lines as they're handled above
    if (
        cleanLine.includes('VALIDATION_FORMULA') ||
        cleanLine.includes('VALIDATION_PASS') ||
        cleanLine.includes('VALIDATION_FAIL')
    ) {
        return null
    }

    // Skip CODE_UNIT lines for validation rules
    if (cleanLine.includes('CODE_UNIT_') && cleanLine.includes('Validation:')) {
        return null
    }

    // Handle CALLOUT events
    if (cleanLine.includes('CALLOUT_')) {
        const isCalloutBegin = cleanLine.includes('CALLOUT_REQUEST')
        const isCalloutEnd = cleanLine.includes('CALLOUT_RESPONSE')
        
        if (isCalloutBegin) {
            const calloutMatch = cleanLine.match(/CALLOUT_REQUEST\|\[(\d+)\]\|(.*)/)
            if (calloutMatch) {
                const [_, lineNum, endpoint] = calloutMatch
                return {
                    id: baseId,
                    time,
                    summary: `${time} | CALLOUT REQUEST | [${lineNum}] | ${endpoint}`,
                    type: 'CALLOUT',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        } else if (isCalloutEnd) {
            const calloutMatch = cleanLine.match(/CALLOUT_RESPONSE\|\[(\d+)\]\|(.*)/)
            if (calloutMatch) {
                const [_, lineNum, response] = calloutMatch
                return {
                    id: baseId,
                    time,
                    summary: `${time} | CALLOUT RESPONSE | [${lineNum}] | ${response}`,
                    type: 'CALLOUT',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        }
    }

    // Handle Visualforce Page events
    if (cleanLine.includes('VF_')) {
        const isPageBegin = cleanLine.includes('VF_PAGE_MESSAGE')
        const isPageEnd = cleanLine.includes('VF_APEX_CALL_END')
        
        if (isPageBegin) {
            const vfMatch = cleanLine.match(/VF_PAGE_MESSAGE\|(.*)/)
            if (vfMatch) {
                const [_, message] = vfMatch
                return {
                    id: baseId,
                    time,
                    summary: `${time} | VF PAGE | ${message}`,
                    type: 'VF_PAGE',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        } else if (isPageEnd) {
            const vfMatch = cleanLine.match(/VF_APEX_CALL_END\|(.*)/)
            if (vfMatch) {
                const [_, details] = vfMatch
                return {
                    id: baseId,
                    time,
                    summary: `${time} | VF APEX CALL END | ${details}`,
                    type: 'VF_PAGE',
                    isCollapsible: false,
                    originalIndex,
                }
            }
        }
    }

    // Handle METHOD_ENTRY and METHOD_EXIT events
    if (cleanLine.includes('METHOD_ENTRY') || cleanLine.includes('METHOD_EXIT')) {
        const isEntry = cleanLine.includes('METHOD_ENTRY')
        const methodMatch = cleanLine.match(/METHOD_(ENTRY|EXIT)\|\[(\d+)\]\|(.*)/)
        
        if (methodMatch) {
            const [_, entryExit, lineNum, methodInfo] = methodMatch
            return {
                id: baseId,
                time,
                summary: `${time} | METHOD ${entryExit} | [${lineNum}] | ${methodInfo}`,
                type: isEntry ? 'METHOD_ENTRY' : 'METHOD_EXIT',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle CONSTRUCTOR_ENTRY and CONSTRUCTOR_EXIT events
    if (cleanLine.includes('CONSTRUCTOR_ENTRY') || cleanLine.includes('CONSTRUCTOR_EXIT')) {
        const isEntry = cleanLine.includes('CONSTRUCTOR_ENTRY')
        const constructorMatch = cleanLine.match(/CONSTRUCTOR_(ENTRY|EXIT)\|\[(\d+)\]\|(.*)/)
        
        if (constructorMatch) {
            const [_, entryExit, lineNum, constructorInfo] = constructorMatch
            return {
                id: baseId,
                time,
                summary: `${time} | CONSTRUCTOR ${entryExit} | [${lineNum}] | ${constructorInfo}`,
                type: isEntry ? 'METHOD_ENTRY' : 'METHOD_EXIT',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle EXCEPTION_THROWN events
    if (cleanLine.includes('EXCEPTION_THROWN')) {
        const exceptionMatch = cleanLine.match(/EXCEPTION_THROWN\|\[(\d+)\]\|(.*)/)
        if (exceptionMatch) {
            const [_, lineNum, exceptionInfo] = exceptionMatch
            return {
                id: baseId,
                time,
                summary: `${time} | EXCEPTION THROWN | [${lineNum}] | ${exceptionInfo}`,
                type: 'DEBUG',
                isCollapsible: false,
                originalIndex,
            }
        }
    }


    // Handle VARIABLE_ASSIGNMENT events
    if (cleanLine.includes('VARIABLE_ASSIGNMENT')) {
        const varMatch = cleanLine.match(/VARIABLE_ASSIGNMENT\|\[(\d+)\]\|(.*)/)
        if (varMatch) {
            const [_, lineNum, varInfo] = varMatch
            return {
                id: baseId,
                time,
                summary: `${time} | VARIABLE ASSIGNMENT | [${lineNum}] | ${varInfo}`,
                type: 'VARIABLE_ASSIGNMENT',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle VARIABLE_SCOPE_BEGIN and VARIABLE_SCOPE_END events
    if (cleanLine.includes('VARIABLE_SCOPE_')) {
        const isBegin = cleanLine.includes('VARIABLE_SCOPE_BEGIN')
        const scopeMatch = cleanLine.match(/VARIABLE_SCOPE_(BEGIN|END)\|\[(\d+)\]\|(.*)/)
        
        if (scopeMatch) {
            const [_, beginEnd, lineNum, scopeInfo] = scopeMatch
            return {
                id: baseId,
                time,
                summary: `${time} | VARIABLE SCOPE ${beginEnd} | [${lineNum}] | ${scopeInfo}`,
                type: 'DEBUG',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle DUPLICATE_DETECTION events - these need special grouping logic
    if (cleanLine.includes('DUPLICATE_DETECTION_')) {
        // Skip individual duplicate detection lines as they'll be handled as a group
        return null
    }

    // Handle FATAL_ERROR events
    if (cleanLine.includes('FATAL_ERROR')) {
        const fatalMatch = cleanLine.match(/FATAL_ERROR\|\[(\d+)\]\|(.*)/)
        if (fatalMatch) {
            const [_, lineNum, errorInfo] = fatalMatch
            return {
                id: baseId,
                time,
                summary: `${time} | FATAL ERROR | [${lineNum}] | ${errorInfo}`,
                type: 'DEBUG',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle SAVEPOINT events
    if (cleanLine.includes('SAVEPOINT_')) {
        const isSet = cleanLine.includes('SAVEPOINT_SET')
        const savepointMatch = cleanLine.match(/SAVEPOINT_(SET|ROLLBACK)\|\[(\d+)\]\|(.*)/)
        
        if (savepointMatch) {
            const [_, setRollback, lineNum, savepointInfo] = savepointMatch
            return {
                id: baseId,
                time,
                summary: `${time} | SAVEPOINT ${setRollback} | [${lineNum}] | ${savepointInfo}`,
                type: 'DEBUG',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle VF_PAGE_MESSAGE events
    if (cleanLine.includes('VF_PAGE_MESSAGE')) {
        const vfMessageMatch = cleanLine.match(/VF_PAGE_MESSAGE\|(.*)/)
        if (vfMessageMatch) {
            const [_, message] = vfMessageMatch
            return {
                id: baseId,
                time,
                summary: `${time} | VF PAGE MESSAGE | ${message}`,
                type: 'VF_PAGE',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle VF_APEX_CALL_START and VF_APEX_CALL_END events
    if (cleanLine.includes('VF_APEX_CALL_')) {
        const isStart = cleanLine.includes('VF_APEX_CALL_START')
        const vfCallMatch = cleanLine.match(/VF_APEX_CALL_(START|END)\|(.*)/)
        
        if (vfCallMatch) {
            const [_, startEnd, callInfo] = vfCallMatch
            return {
                id: baseId,
                time,
                summary: `${time} | VF APEX CALL ${startEnd} | ${callInfo}`,
                type: 'VF_PAGE',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    // Handle USER_INFO events
    if (cleanLine.includes('USER_INFO')) {
        const userInfoMatch = cleanLine.match(/USER_INFO\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)/)
        if (userInfoMatch) {
            const [_, userId, email, timezone, gmtOffset] = userInfoMatch
            return {
                id: baseId,
                time,
                summary: `${time} | USER INFO | ${email} | ${timezone}`,
                type: 'USER_INFO',
                isCollapsible: false,
                originalIndex,
            }
        }
    }

    return {
        id: baseId,
        time,
        summary: cleanLine,
        type: 'STANDARD',
        originalIndex,
    }
}

// Add SQL keywords to be bolded
const SQL_KEYWORDS = [
    'SELECT',
    'FROM',
    'WHERE',
    'AND',
    'OR',
    'LIMIT',
    'ORDER BY',
    'GROUP BY',
    'IN',
    'LIKE',
    'TYPEOF',
    'OFFSET',
    'HAVING',
    'INCLUDES',
    'EXCLUDES',
    'NOT',
]

function boldSqlKeywords(sql: string): string {
    let result = sql
    SQL_KEYWORDS.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        result = result.replace(regex, `**${keyword}**`)
    })
    return result
}

export function formatLogs(lines: string[]): FormattedLine[] {
    const formattedLines: FormattedLine[] = []
    let collectingLimits = false
    let currentNamespace = ''
    let namespaceLimits: NamespaceLimits = {}
    let currentTime = ''
    let skipUntilIndex = -1  // Add this to track which lines to skip

    // First pass: create array with original indices
    const validLines = lines
        .map((line, index) => ({
            content: line.trim(),
            originalIndex: index,
        }))
        .filter(({ content, originalIndex }) => {
            // Filter out the first debug line
            if (content.match(/^\[\d+\](\|.*)?$/)) {
                return false
            }

            // Filter out empty lines and standalone zeros
            if (!(content.match(/\d{2}:\d{2}:\d{2}/) || (content !== '0' && content !== ''))) {
                return false
            }

            // Filter out SYSTEM_MODE and SYSTEM_METHOD lines
            if (
                content.includes('SYSTEM_MODE_ENTER') ||
                content.includes('SYSTEM_MODE_EXIT') ||
                content.includes('SYSTEM_METHOD_ENTER') ||
                content.includes('SYSTEM_METHOD_EXIT') ||
                content.includes('EXECUTION_STARTED') ||
                content.includes('EXECUTION_FINISHED') ||
                (content.includes('CODE_UNIT_FINISHED') && content.includes('DuplicateDetector')) ||
                content.includes('HEAP_ALLOCATE') ||
                content.includes('STATEMENT_EXECUTE') ||
                content.includes('VARIABLE_SCOPE_BEGIN')
            ) {
                return false
            }

            return true
        })

    for (let i = 0; i < validLines.length; i++) {
        // Skip lines that are part of a validation rule we've already processed
        if (validLines[i].originalIndex <= skipUntilIndex) {
            continue
        }

        const { content, originalIndex } = validLines[i]

        // If this is a validation rule, find where it ends
        if (content.includes('VALIDATION_RULE')) {
            let j = i + 1
            while (j < validLines.length) {
                const nextLine = validLines[j].content
                if (nextLine.includes('VALIDATION_PASS') || 
                    nextLine.includes('VALIDATION_FAIL') ||
                    nextLine.includes('CODE_UNIT_FINISHED')) {
                    // Don't skip the CODE_UNIT_FINISHED line itself, just mark it as the end
                    if (nextLine.includes('CODE_UNIT_FINISHED')) {
                        skipUntilIndex = validLines[j].originalIndex - 1
                    } else {
                        skipUntilIndex = validLines[j].originalIndex
                    }
                    break
                }
                j++
            }
        }

        // Handle duplicate detection events as a group
        if (content.includes('DUPLICATE_DETECTION_BEGIN')) {
            let duplicateRuleInfo = null
            let duplicateCount = 0
            let j = i + 1
            
            // Look for the rule invocation line and match details
            while (j < validLines.length && j < i + 10) { // Look ahead max 10 lines
                const nextLine = validLines[j].content
                
                if (nextLine.includes('DUPLICATE_DETECTION_RULE_INVOCATION')) {
                    const ruleMatch = nextLine.match(/DUPLICATE_DETECTION_RULE_INVOCATION\|DuplicateRuleId:([^|]+)\|DuplicateRuleName:([^|]+)\|DmlType:([^|]*)/)
                    if (ruleMatch) {
                        const [_, ruleId, ruleName, dmlType] = ruleMatch
                        duplicateRuleInfo = { ruleId, ruleName, dmlType: dmlType || 'UNKNOWN' }
                    }
                } else if (nextLine.includes('DUPLICATE_DETECTION_MATCH_INVOCATION_SUMMARY')) {
                    const summaryMatch = nextLine.match(/DUPLICATE_DETECTION_MATCH_INVOCATION_SUMMARY\|EntityType:([^|]+)\|NumRecordsToBeSaved:(\d+)\|NumRecordsToBeSavedWithDuplicates:(\d+)\|NumDuplicateRecordsFound:(\d+)/)
                    if (summaryMatch) {
                        const [_, entityType, recordsToBeSaved, recordsWithDuplicates, duplicateRecordsFound] = summaryMatch
                        duplicateCount = parseInt(duplicateRecordsFound) || 0
                    }
                } else if (nextLine.includes('DUPLICATE_DETECTION_END')) {
                    skipUntilIndex = validLines[j].originalIndex
                    break
                }
                j++
            }
            
            // Create a single formatted line for the duplicate detection
            if (duplicateRuleInfo) {
                const timeMatch = content.match(/(\d{2}:\d{2}:\d{2})/)
                const time = timeMatch ? timeMatch[1] : ''
                
                let summary = `${time} | DUPLICATE RULE | Id: ${duplicateRuleInfo.ruleId} | Name: ${duplicateRuleInfo.ruleName} | Type: ${duplicateRuleInfo.dmlType}`
                if (duplicateCount > 0) {
                    summary += ` | # Duplicates: ${duplicateCount}`
                }
                
                formattedLines.push({
                    id: `line_${originalIndex}`,
                    time,
                    summary,
                    type: 'DUPLICATE_DETECTION',
                    isCollapsible: false,
                    originalIndex,
                })
            }
            continue
        }

        // Handle regular lines when not collecting limits
        if (!collectingLimits && 
            !content.includes('CUMULATIVE_LIMIT_USAGE') && 
            !content.includes('SOQL_EXECUTE_BEGIN')
        ) {
            const formattedLine = formatLogLine(content, originalIndex, lines)
            if (formattedLine) {
                formattedLines.push(formattedLine)
            }
        }

        // Handle limits collection
        if (content.includes('CUMULATIVE_LIMIT_USAGE') && !content.includes('CUMULATIVE_LIMIT_USAGE_END')) {
            collectingLimits = true
            continue
        }

        const nextLine = i < validLines.length - 1 ? validLines[i + 1].content : ''

        const timeMatch = content.match(/(\d{2}:\d{2}:\d{2})/)
        if (timeMatch) {
            currentTime = timeMatch[1]
        }

        // Handle SOQL execution pairs
        const soqlBeginMatch = content.match(/\|SOQL_EXECUTE_BEGIN\|(\[(\d+)\])(.*)/)
        if (soqlBeginMatch) {
            let rowCount = ''
            let aggregations = ''

            // Extract line number and any aggregations info
            const [_, bracketsFull, lineNumber, restOfQuery] = soqlBeginMatch
            const aggregationsMatch = restOfQuery.match(/\|Aggregations:(\d+)\|/)
            if (aggregationsMatch) {
                aggregations = ` | Aggregations: ${aggregationsMatch[1]}`
            }

            if (nextLine && nextLine.includes('SOQL_EXECUTE_END')) {
                const rowMatch = nextLine.match(/\|Rows:(\d+)/)
                if (rowMatch) {
                    rowCount = ` | Rows: ${rowMatch[1]}`
                    i++ // Skip the END line
                }
            }

            const formattedLine = formatLogLine(content, originalIndex, lines)
            if (!formattedLine) continue

            const sqlQuery = restOfQuery.replace(/\|Aggregations:\d+\|/, '').trim()

            formattedLines.push({
                ...formattedLine,
                summary: `${formattedLine.time} | SOQL [${lineNumber}] | ${boldSqlKeywords(sqlQuery)}${aggregations}${rowCount}`,
                type: 'SOQL',
                isCollapsible: false,
                originalIndex,
            })
            continue
        }

        // Skip SOQL_EXECUTE_END lines as they're handled above
        if (content.includes('SOQL_EXECUTE_END')) {
            continue
        }

        if (content.includes('CUMULATIVE_LIMIT_USAGE') && !content.includes('CUMULATIVE_LIMIT_USAGE_END')) {
            collectingLimits = true
            continue
        }

        // Handle namespace declaration
        if (collectingLimits && content.includes('LIMIT_USAGE_FOR_NS')) {
            const namespaceMatch = content.match(/LIMIT_USAGE_FOR_NS\|([^|]+)/)
            if (namespaceMatch) {
                currentNamespace = namespaceMatch[1]
                namespaceLimits[currentNamespace] = {}
            }
            continue
        }

        if (collectingLimits) {
            const metricMatch = content.match(/^(.*?):\s*(\d+)\s*out of\s*(\d+)/)
            if (metricMatch) {
                const [_, name, used, total] = metricMatch
                if (currentNamespace && namespaceLimits[currentNamespace]) {
                    namespaceLimits[currentNamespace][name.trim()] = {
                        used: parseInt(used),
                        total: parseInt(total),
                    }
                }
            }
        }

        if (content.includes('CUMULATIVE_LIMIT_USAGE_END')) {
            // Process each namespace's limits
            Object.entries(namespaceLimits).forEach(([namespace, limitData]) => {
                const metrics = []
                metrics.push(`Limits (${namespace})`)

                // Always show SOQL metrics if they exist
                if (limitData['Number of SOQL queries']) {
                    metrics.push(
                        `🔍 SOQL: ${limitData['Number of SOQL queries'].used}/${limitData['Number of SOQL queries'].total} Queries, ${limitData['Number of query rows']?.used || 0}/${limitData['Number of query rows']?.total || 0} Rows`,
                    )
                }

                // Always show DML metrics if they exist
                if (limitData['Number of DML statements']) {
                    metrics.push(
                        `🔶 DML: ${limitData['Number of DML statements'].used}/${limitData['Number of DML statements'].total} Statements, ${limitData['Number of DML rows']?.used || 0}/${limitData['Number of DML rows']?.total || 0} Rows`,
                    )
                }

                // Always show CPU/Heap metrics if they exist
                if (limitData['Maximum CPU time']) {
                    const heapUsedKB = Math.round(limitData['Maximum heap size']?.used / 1024) || 0
                    const heapTotalKB = Math.round(limitData['Maximum heap size']?.total / 1024) || 0
                    metrics.push(
                        `💻 CPU: ${limitData['Maximum CPU time'].used}ms, Heap: ${heapUsedKB}/${heapTotalKB}KB`,
                    )
                }

                // Always add limits line if we have any data
                if (metrics.length > 0) {
                    formattedLines.push({
                        id: `line_${originalIndex}`,
                        time: currentTime,
                        summary: metrics.join(' | '),
                        type: 'LIMITS',
                        isCollapsible: false,
                        originalIndex,
                    })
                }
            })

            // If no namespaces were processed, add a default limits line
            if (Object.keys(namespaceLimits).length === 0) {
                formattedLines.push({
                    id: `line_${originalIndex}`,
                    time: currentTime,
                    summary: `${currentTime} | Limits (default) | No limit data available`,
                    type: 'LIMITS',
                    isCollapsible: false,
                    originalIndex,
                })
            }

            collectingLimits = false
            namespaceLimits = {}
            continue
        }
    }

    return formattedLines
}
