import { QueryContext } from '@/types/soql'

// SOQL keywords for better parsing
const SOQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET',
  'AND', 'OR', 'NOT', 'IN', 'LIKE', 'NULL', 'TRUE', 'FALSE'
])

// SOQL operators
const SOQL_OPERATORS = new Set([
  '=', '!=', '<', '>', '<=', '>=', 'LIKE', 'IN', 'NOT', 'AND', 'OR'
])

interface ParsedQuery {
  selectClause: string
  fromClause: string
  whereClause: string
  orderByClause: string
  groupByClause: string
  havingClause: string
  limitClause: string
  offsetClause: string
}

function parseSOQLQuery(query: string): ParsedQuery {
  const queryUpper = query.toUpperCase().trim()
  
  // Extract clauses using regex patterns similar to Salesforce Inspector
  const selectMatch = queryUpper.match(/SELECT\s+([\s\S]*?)(?=\s+FROM\b)/i)
  const fromMatch = queryUpper.match(/FROM\s+([\s\S]*?)(?=\s+(?:WHERE|ORDER\s+BY|GROUP\s+BY|HAVING|LIMIT|OFFSET|$))/i)
  
  const whereMatch = queryUpper.match(/WHERE\s+([\s\S]*?)(?=\s+(?:ORDER\s+BY|GROUP\s+BY|HAVING|LIMIT|OFFSET|$))/i)
  const orderByMatch = queryUpper.match(/ORDER\s+BY\s+([\s\S]*?)(?=\s+(?:GROUP\s+BY|HAVING|LIMIT|OFFSET|$))/i)
  const groupByMatch = queryUpper.match(/GROUP\s+BY\s+([\s\S]*?)(?=\s+(?:HAVING|LIMIT|OFFSET|$))/i)
  const havingMatch = queryUpper.match(/HAVING\s+([\s\S]*?)(?=\s+(?:LIMIT|OFFSET|$))/i)
  const limitMatch = queryUpper.match(/LIMIT\s+(\d+)/i)
  const offsetMatch = queryUpper.match(/OFFSET\s+(\d+)/i)
  
  return {
    selectClause: selectMatch ? selectMatch[1].trim() : '',
    fromClause: fromMatch ? fromMatch[1].trim() : '',
    whereClause: whereMatch ? whereMatch[1].trim() : '',
    orderByClause: orderByMatch ? orderByMatch[1].trim() : '',
    groupByClause: groupByMatch ? groupByMatch[1].trim() : '',
    havingClause: havingMatch ? havingMatch[1].trim() : '',
    limitClause: limitMatch ? limitMatch[1].trim() : '',
    offsetClause: offsetMatch ? offsetMatch[1].trim() : ''
  }
}

function getCurrentWordAtCursor(query: string, cursorPosition: number): string {
  const beforeCursor = query.substring(0, cursorPosition)
  
  // Check if we're at the end of a relationship (after a period)
  if (beforeCursor.endsWith('.')) {
    return ''
  }
  
  // Get the current word being typed
  const wordMatch = beforeCursor.match(/(\w+(?:\.\w+)*)$/)
  if (!wordMatch) return ''
  
  const fullWord = wordMatch[1]
  
  // If the word contains a period, we only want the part after the last period
  // This handles cases like "CreatedBy.Name" where we want just "Name"
  if (fullWord.includes('.')) {
    const parts = fullWord.split('.')
    return parts[parts.length - 1]
  }
  
  return fullWord
}

function isInClause(query: string, cursorPosition: number, clause: string): boolean {
  const beforeCursor = query.substring(0, cursorPosition).toUpperCase()
  return beforeCursor.includes(clause.toUpperCase())
}

function getSObjectFromFromClause(fromClause: string): string | undefined {
  if (!fromClause) return undefined
  
  // Extract the first word after FROM (the SObject name)
  const sobjectMatch = fromClause.match(/^(\w+)/)
  return sobjectMatch ? sobjectMatch[1] : undefined
}

function getSObjectFromQuery(query: string): string | undefined {
  // Simple fallback: look for FROM followed by a word
  const fromMatch = query.match(/FROM\s+(\w+)/i)
  return fromMatch ? fromMatch[1] : undefined
}

export function parseQueryContext(query: string, cursorPosition: number): QueryContext {
  const lines = query.substring(0, cursorPosition).split('\n')
  const line = lines.length - 1
  const column = lines[lines.length - 1].length

  // Get the current word being typed
  const currentWord = getCurrentWordAtCursor(query, cursorPosition)
  
  // Parse the entire query to get structured information
  const parsedQuery = parseSOQLQuery(query)
  const sobject = getSObjectFromFromClause(parsedQuery.fromClause) || getSObjectFromQuery(query)
  
  // Determine which clause we're currently in based on cursor position
  const beforeCursor = query.substring(0, cursorPosition).toUpperCase()
  
  
  // Check if we're in FROM clause - look for FROM keyword and cursor is after it
  // But make sure we're not in a later clause (WHERE, ORDER BY, etc.)
  const fromIndex = beforeCursor.lastIndexOf('FROM')
  const whereIndex = beforeCursor.lastIndexOf('WHERE')
  const orderByIndex = beforeCursor.lastIndexOf('ORDER BY')
  const groupByIndex = beforeCursor.lastIndexOf('GROUP BY')
  const havingIndex = beforeCursor.lastIndexOf('HAVING')
  
  if (fromIndex !== -1 && 
      (whereIndex === -1 || fromIndex > whereIndex) &&
      (orderByIndex === -1 || fromIndex > orderByIndex) &&
      (groupByIndex === -1 || fromIndex > groupByIndex) &&
      (havingIndex === -1 || fromIndex > havingIndex)) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'FROM',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Check if we're in SELECT clause - look for SELECT keyword and cursor is after it
  // But make sure we're not in a FROM, WHERE, or other clause that comes after SELECT
  if (beforeCursor.includes('SELECT') && 
      !beforeCursor.includes('FROM') && 
      !beforeCursor.includes('WHERE') && 
      !beforeCursor.includes('ORDER BY') && 
      !beforeCursor.includes('GROUP BY') && 
      !beforeCursor.includes('HAVING')) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'SELECT',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Special case: SELECT clause with FROM clause (for field suggestions)
  if (beforeCursor.includes('SELECT') && 
      beforeCursor.includes('FROM') && 
      !beforeCursor.includes('WHERE') && 
      !beforeCursor.includes('ORDER BY') && 
      !beforeCursor.includes('GROUP BY') && 
      !beforeCursor.includes('HAVING')) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'SELECT',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Check if we're in WHERE clause
  if (beforeCursor.includes('WHERE')) {
    // Check if we're at a field position in WHERE clause
    const whereFieldMatch = beforeCursor.match(/(?:WHERE|AND|OR)\s+([\w.]+)\s*$/)
    if (whereFieldMatch) {
      const potentialField = whereFieldMatch[1]
      
      // Check if this looks like a field (not an operator or keyword)
      if (!SOQL_OPERATORS.has(potentialField.toUpperCase()) && 
          !SOQL_KEYWORDS.has(potentialField.toUpperCase())) {
        return {
          position: cursorPosition,
          line,
          column,
          currentWord: potentialField,
          context: 'WHERE',
          sobject: sobject,
          relationshipPath: []
        }
      }
    }
    
    return {
      position: cursorPosition,
      line,
      column,
      currentWord: '',
      context: 'WHERE',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Check if we're in ORDER BY clause
  if (orderByIndex !== -1 && 
      (groupByIndex === -1 || orderByIndex > groupByIndex) &&
      (havingIndex === -1 || orderByIndex > havingIndex)) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'ORDER_BY',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Check if we're in GROUP BY clause
  if (groupByIndex !== -1 && 
      (havingIndex === -1 || groupByIndex > havingIndex)) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'GROUP_BY',
      sobject: sobject,
      relationshipPath: []
    }
  }

  // Check if we're in HAVING clause
  if (havingIndex !== -1) {
    return {
      position: cursorPosition,
      line,
      column,
      currentWord,
      context: 'HAVING',
      sobject: sobject,
      relationshipPath: []
    }
  }

  return {
    position: cursorPosition,
    line,
    column,
    currentWord,
    context: 'UNKNOWN',
    sobject: sobject,
    relationshipPath: []
  }
}

export function getRelationshipPath(fieldName: string): string[] {
  return fieldName.split('.').slice(0, -1) // Remove the last part (field name)
}

export function getFieldName(fieldName: string): string {
  const parts = fieldName.split('.')
  return parts[parts.length - 1]
}

export function isRelationshipField(fieldName: string): boolean {
  return fieldName.includes('.')
}

export function getParentObjectFromRelationship(relationshipPath: string[], sobject: string): string {
  if (relationshipPath.length === 0) {
    return sobject
  }
  
  // For now, we'll need to look up the relationship to find the parent object
  // This would typically involve checking the field's referenceTo property
  return relationshipPath[relationshipPath.length - 1]
}

export function parseRelationshipContextFromQuery(query: string, cursorPosition: number, baseSObject: string): {
  currentSObject: string
  relationshipPath: string[]
  currentField: string
} {
  const beforeCursor = query.substring(0, cursorPosition)
  
  // Find the current field being typed - look for the last word or relationship path
  const fieldMatch = beforeCursor.match(/(\w+(?:\.\w+)*)$/)
  const currentField = fieldMatch ? fieldMatch[1] : ''
  
  // If we're at the end of a relationship (after a period), extract the relationship path
  if (beforeCursor.endsWith('.')) {
    // Find the relationship path by looking for the last complete relationship
    // Look for word characters followed by a period at the end
    const relationshipMatch = beforeCursor.match(/(\w+(?:\.\w+)*)\.$/)
    if (relationshipMatch) {
      const relationshipPath = relationshipMatch[1].split('.')
      return {
        currentSObject: baseSObject, // Will be resolved by the caller
        relationshipPath,
        currentField: ''
      }
    }
    return {
      currentSObject: baseSObject,
      relationshipPath: [],
      currentField: ''
    }
  }
  
  // Parse the relationship path from the current field
  if (currentField.includes('.')) {
    const parts = currentField.split('.')
    const relationshipPath = parts.slice(0, -1) // All parts except the last (field name)
    const fieldName = parts[parts.length - 1] // The actual field being typed
    
    return {
      currentSObject: baseSObject, // Will be resolved by the caller
      relationshipPath,
      currentField: fieldName
    }
  }
  
  // No relationship, just a regular field
  return {
    currentSObject: baseSObject,
    relationshipPath: [],
    currentField: currentField
  }
}
