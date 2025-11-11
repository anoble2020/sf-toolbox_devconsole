'use client'

import * as React from 'react'

interface SOQLSyntaxHighlighterProps {
  query: string
  className?: string
}

// SOQL keywords and operators that should be highlighted
const SOQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'DESC', 'ASC', 'NULLS FIRST', 'NULLS LAST'
]

const SOQL_OPERATORS = [
  'LIKE', 'IN', 'INCLUDES', 'EXCLUDES', 'NOT IN', 'NOT', 'AND', 'OR', 'TYPEOF', 'END', 'THEN'
]

// Date literals from Salesforce documentation
const DATE_LITERALS = [
  'YESTERDAY', 'TODAY', 'TOMORROW', 'LAST_WEEK', 'THIS_WEEK', 'NEXT_WEEK',
  'LAST_MONTH', 'THIS_MONTH', 'NEXT_MONTH', 'LAST_90_DAYS', 'NEXT_90_DAYS',
  'LAST_N_DAYS', 'NEXT_N_DAYS', 'NEXT_N_WEEKS', 'LAST_N_WEEKS', 'NEXT_N_MONTHS',
  'LAST_N_MONTHS', 'THIS_QUARTER', 'LAST_QUARTER', 'NEXT_QUARTER', 'NEXT_N_QUARTERS',
  'LAST_N_QUARTERS', 'THIS_YEAR', 'LAST_YEAR', 'NEXT_YEAR', 'NEXT_N_YEARS',
  'LAST_N_YEARS', 'THIS_FISCAL_QUARTER', 'LAST_FISCAL_QUARTER', 'NEXT_FISCAL_QUARTER',
  'NEXT_N_FISCAL_QUARTERS', 'LAST_N_FISCAL_QUARTERS', 'THIS_FISCAL_YEAR',
  'LAST_FISCAL_YEAR', 'NEXT_FISCAL_YEAR', 'NEXT_N_FISCAL_YEARS', 'LAST_N_FISCAL_YEARS'
]

function highlightSOQL(text: string): React.ReactNode[] {
  if (!text) return [text]

  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let matched = false

    // Check for keywords (case insensitive)
    for (const keyword of SOQL_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i')
      const match = remaining.match(regex)
      if (match && match.index === 0) {
        parts.push(
          <span key={key++} className="font-bold text-blue-500">
            {match[0].toUpperCase()}
          </span>
        )
        remaining = remaining.substring(match[0].length)
        matched = true
        break
      }
    }

    if (matched) continue

    // Check for operators (case insensitive)
    for (const operator of SOQL_OPERATORS) {
      const regex = new RegExp(`\\b${operator.replace(/\s+/g, '\\s+')}\\b`, 'i')
      const match = remaining.match(regex)
      if (match && match.index === 0) {
        parts.push(
          <span key={key++} className="font-bold text-orange-600">
            {match[0].toUpperCase()}
          </span>
        )
        remaining = remaining.substring(match[0].length)
        matched = true
        break
      }
    }

    if (matched) continue

    // Check for date literals (case insensitive)
    for (const dateLiteral of DATE_LITERALS) {
      const regex = new RegExp(`\\b${dateLiteral}\\b`, 'i')
      const match = remaining.match(regex)
      if (match && match.index === 0) {
        parts.push(
          <span key={key++} className="font-bold text-green-600">
            {match[0].toUpperCase()}
          </span>
        )
        remaining = remaining.substring(match[0].length)
        matched = true
        break
      }
    }

    if (matched) continue

    // Check for null (case insensitive)
    const nullMatch = remaining.match(/\bnull\b/i)
    if (nullMatch && nullMatch.index === 0) {
      parts.push(
        <span key={key++} className="text-purple-600 font-medium">
          {nullMatch[0].toLowerCase()}
        </span>
      )
      remaining = remaining.substring(nullMatch[0].length)
      matched = true
    }

    if (matched) continue

    // No match found, add the next character as plain text
    parts.push(
      <span key={key++} className="text-black">
        {remaining[0]}
      </span>
    )
    remaining = remaining.substring(1)
  }

  return parts
}

export function SOQLSyntaxHighlighter({ query, className }: SOQLSyntaxHighlighterProps) {
  return (
    <div className={className}>
      {highlightSOQL(query)}
    </div>
  )
}
