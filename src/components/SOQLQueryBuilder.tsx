'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { InlineSuggestions } from '@/components/InlineSuggestions'
import { FieldValidationOverlay } from '@/components/FieldValidationOverlay'
import { SOQLSyntaxOverlay } from '@/components/SOQLSyntaxOverlay'
import { parseQueryContext, getRelationshipPath, getFieldName, parseRelationshipContextFromQuery } from '@/lib/soqlParser'
import { QueryContext } from '@/types/soql'
import { Loader2 } from 'lucide-react'

interface SOQLQueryBuilderProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoCompleteEnabled?: boolean
}

export function SOQLQueryBuilder({
  value,
  onChange,
  placeholder = "Enter your SOQL query...",
  className,
  autoCompleteEnabled = false
}: SOQLQueryBuilderProps) {
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [queryContext, setQueryContext] = React.useState<QueryContext | null>(null)
  const [currentWord, setCurrentWord] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [isLoadingSObject, setIsLoadingSObject] = React.useState(false)
  const [breadcrumbs, setBreadcrumbs] = React.useState<string[]>([])
  const [currentSObject, setCurrentSObject] = React.useState<string | undefined>()
  const [relationshipPath, setRelationshipPath] = React.useState<string[]>([])
  const [parsedRelationshipContext, setParsedRelationshipContext] = React.useState<{
    currentSObject: string
    relationshipPath: string[]
    currentField: string
  } | null>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const suggestionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const fieldLogTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current)
      }
      if (fieldLogTimeoutRef.current) {
        clearTimeout(fieldLogTimeoutRef.current)
      }
    }
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Update cursor position
    const newCursorPosition = e.target.selectionStart
    setCursorPosition(newCursorPosition)
    
    try {
      // Parse query context
      const context = parseQueryContext(newValue, newCursorPosition)
      setQueryContext(context)
      setCurrentWord(context.currentWord)
      
      // Parse relationship context from the actual query text
      if (context.sobject) {
        const relationshipContext = parseRelationshipContextFromQuery(newValue, newCursorPosition, context.sobject)
        setParsedRelationshipContext(relationshipContext)
        
        // Update the current SObject and relationship path based on the actual query
        if (relationshipContext.relationshipPath.length > 0) {
          // We need to resolve the actual SObject for this relationship path
          import('@/lib/sobjectService').then(({ sobjectService }) => {
            sobjectService.resolveSObjectFromRelationshipPath(context.sobject!, relationshipContext.relationshipPath)
              .then(resolvedSObject => {
                setCurrentSObject(resolvedSObject)
                setRelationshipPath(relationshipContext.relationshipPath)
                setBreadcrumbs(relationshipContext.relationshipPath)
              })
          })
        } else {
          // No relationship, reset to base SObject
          setCurrentSObject(context.sobject)
          setRelationshipPath([])
          setBreadcrumbs([])
        }
      }
      
      // Clear existing timeout
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current)
      }
      
      // Show suggestions with a small delay to prevent immediate appearance when clicking
      const shouldShow = context && (
        context.context === 'SELECT' || 
        context.context === 'FROM' || 
        context.context === 'WHERE' ||
        context.context === 'ORDER_BY' ||
        context.context === 'GROUP_BY'
      ) && (
        // For SELECT context with SObject, show suggestions even without current word
        (context.context === 'SELECT' && context.sobject) ||
        // For other contexts, require a current word
        (context.context !== 'SELECT' && context.currentWord.length > 0)
      ) && 
      // Only check for space ending if there's a current word
      (context.currentWord.length === 0 || !context.currentWord.endsWith(' '))
      
      
      // Check if SObject name is complete (has space after it or is selected from dropdown)
      // Only consider it complete if the SObject name is followed by a space, newline, or is at the end of the query
      // Also ensure it's not just a single character and not currently being typed
      const isSObjectComplete = context?.sobject && 
        context.sobject.length > 1 && // Ensure it's not just a single character
        !context.currentWord && // Not currently typing a word
        (newValue.includes(`${context.sobject} `) || // Space after SObject
         newValue.includes(`${context.sobject}\n`) || // Newline after SObject
         newValue.endsWith(context.sobject)) // Ends with SObject (selected from dropdown)



      // Check loading state for SObject only when in FROM context
      if (context?.sobject && context.context === 'FROM') {
        import('@/lib/sobjectService').then(({ sobjectService }) => {
          setIsLoadingSObject(sobjectService.isLoadingSObject(context.sobject!))
        })
      } else {
        setIsLoadingSObject(false)
      }
      
      if (shouldShow && autoCompleteEnabled) {
        // Small delay to prevent immediate appearance when clicking
        suggestionTimeoutRef.current = setTimeout(() => {
          setShowSuggestions(true)
        }, 100) // Reduced delay for faster response
      } else {
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Error parsing query context:', error)
      setShowSuggestions(false)
    }
  }


  const handleCursorChange = () => {
    if (textareaRef.current) {
      const newCursorPosition = textareaRef.current.selectionStart
      setCursorPosition(newCursorPosition)
      
      try {
        const context = parseQueryContext(value, newCursorPosition)
        setQueryContext(context)
        setCurrentWord(context.currentWord)
        
        // Hide suggestions when cursor changes (user is navigating)
        setShowSuggestions(false)
      } catch (error) {
        console.error('Error parsing query context in cursor change:', error)
        setShowSuggestions(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow normal typing while suggestions are open
    // Don't interfere with normal textarea behavior
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const insertText = (text: string) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const beforeCursor = value.substring(0, start)
    const afterCursor = value.substring(end)
    
    // Find the start of the current word - look for space, comma, or start of line
    let wordStart = 0
    for (let i = beforeCursor.length - 1; i >= 0; i--) {
      const char = beforeCursor[i]
      if (char === ' ' || char === ',' || char === '\n') {
        wordStart = i + 1
        break
      }
    }
    
    const beforeWord = beforeCursor.substring(0, wordStart)
    const afterWord = afterCursor
    
    const newValue = beforeWord + text + afterWord
    onChange(newValue)
    
    // Set cursor position after the inserted text
    const newCursorPosition = beforeWord.length + text.length
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleNavigateToRelationship = async (relationshipName: string, targetSObject?: string) => {
    // Replace the current word with the relationship name + "."
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const beforeCursor = value.substring(0, start)
      const afterCursor = value.substring(end)
      
      // Find the start of the current word being typed
      let wordStart = 0
      for (let i = beforeCursor.length - 1; i >= 0; i--) {
        const char = beforeCursor[i]
        if (char === ' ' || char === ',' || char === '\n' || char === '.') {
          wordStart = i + 1
          break
        }
      }
      
      const beforeWord = beforeCursor.substring(0, wordStart)
      const newValue = beforeWord + relationshipName + '.' + afterCursor
      
      // Update the query value
      onChange(newValue)
      
      // Set cursor position after the inserted text
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = wordStart + relationshipName.length + 1
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
          textareaRef.current.focus()
        }
      }, 0)
    }
    
    // Add the relationship name to breadcrumbs (for display)
    setBreadcrumbs(prev => [...prev, relationshipName])
    
    // Track the relationship path
    setRelationshipPath(prev => [...prev, relationshipName])
    
    // Set the current SObject to the referenced SObject (if provided)
    if (targetSObject) {
      setCurrentSObject(targetSObject)
    }
    
    // Keep suggestions open for relationship navigation
    setShowSuggestions(true)
    
    // Force a refresh of the suggestions with the new SObject
    setTimeout(() => {
      setShowSuggestions(true)
    }, 100)
  }

  const handleNavigateToBreadcrumb = (index: number) => {
    // Navigate back to the selected breadcrumb level
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
    const newRelationshipPath = relationshipPath.slice(0, index + 1)
    
    setBreadcrumbs(newBreadcrumbs)
    setRelationshipPath(newRelationshipPath)
    
    // Update current SObject based on breadcrumb level
    if (index === -1) {
      // Back to original SObject
      const context = parseQueryContext(value, textareaRef.current?.selectionStart || 0)
      setCurrentSObject(context.sobject)
    } else {
      // For breadcrumb navigation, we need to determine the SObject at this level
      // This is a simplified approach - in a real implementation, we'd need to track
      // the SObject for each relationship level
      const context = parseQueryContext(value, textareaRef.current?.selectionStart || 0)
      setCurrentSObject(context.sobject)
    }
    
    // Keep suggestions open for breadcrumb navigation
    setShowSuggestions(true)
  }

  const handleSelect = (selectedValue: string) => {
    if (!queryContext) return

    // Hide suggestions after selection
    setShowSuggestions(false)

    if (queryContext.context === 'SELECT') {
      // For SELECT clause, we need to be more careful about comma handling
      const beforeCursor = value.substring(0, cursorPosition)
      
      // Find the start of the SELECT clause
      const selectIndex = beforeCursor.toUpperCase().lastIndexOf('SELECT')
      if (selectIndex === -1) {
        insertText(selectedValue)
        return
      }
      
      const selectClauseStart = selectIndex + 6 // "SELECT".length
      const afterSelect = beforeCursor.substring(selectClauseStart).trim()
      
      // Check if there are already fields (non-empty content after SELECT)
      const hasExistingFields = afterSelect.length > 0
      
      // If the user has typed a partial word (currentWord is not empty),
      // we should just replace that partial word with the selected value.
      // The insertText function already handles replacing the current word,
      // and will preserve any existing comma before it.
      if (queryContext.currentWord) {
        // User is typing a partial word - just replace it
        insertText(selectedValue)
      } else if (relationshipPath.length > 0) {
        // We're in a relationship context, insert the full relationship path + field
        const fullFieldPath = relationshipPath.join('.') + '.' + selectedValue
        insertText(fullFieldPath)
      } else if (beforeCursor.endsWith('.')) {
        // We're at the end of a relationship (after a period), just insert the field name
        insertText(selectedValue)
      } else if (!hasExistingFields) {
        // First field - no comma needed
        insertText(selectedValue)
      } else {
        // There are existing fields, and no partial word was typed.
        // Check if we need a comma.
        const trimmedBeforeCursor = beforeCursor.trim()
        const endsWithComma = trimmedBeforeCursor.endsWith(',') || trimmedBeforeCursor.endsWith(', ')
        
        if (endsWithComma) {
          // Already has a comma, just insert the field
          insertText(selectedValue)
        } else {
          // Add comma and space before the new field
          insertText(`, ${selectedValue}`)
        }
      }
    } else if (queryContext.context === 'FROM') {
      insertText(selectedValue)
    } else if (queryContext.context === 'WHERE' || queryContext.context === 'ORDER_BY' || queryContext.context === 'GROUP_BY') {
      // Check if we're in a relationship context
      if (parsedRelationshipContext && parsedRelationshipContext.relationshipPath.length > 0) {
        // We're in a relationship context, insert the full relationship path + field
        const fullFieldPath = parsedRelationshipContext.relationshipPath.join('.') + '.' + selectedValue
        insertText(fullFieldPath)
      } else {
        // Regular field selection
        insertText(selectedValue)
      }
    }

    // Ensure textarea maintains focus after selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Calculate the position of the suggestions dropdown
  const getSuggestionPosition = () => {
    if (!textareaRef.current) return { top: 0, left: 0 }
    
    const textarea = textareaRef.current
    
    // Get the current line and calculate word position
    const lines = value.substring(0, cursorPosition).split('\n')
    const currentLine = lines.length - 1
    const currentLineText = lines[currentLine]
    
    // Find the start of the current word being typed
    const beforeCursor = currentLineText.substring(0, cursorPosition - value.substring(0, cursorPosition).lastIndexOf('\n') - 1)
    const wordStart = beforeCursor.lastIndexOf(' ') + 1
    
    // Create a temporary element to measure text width
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return { top: 0, left: 0 }
    
    // Get the computed style of the textarea
    const computedStyle = window.getComputedStyle(textarea)
    context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`
    
    // Measure the text before the current word
    const textBeforeWord = currentLineText.substring(0, wordStart)
    const textWidth = context.measureText(textBeforeWord).width
    
    const lineHeight = parseInt(computedStyle.lineHeight) || 20
    const top = (currentLine * lineHeight) + lineHeight + 4 // 4px margin as requested
    
    return {
      top: top,
      left: textWidth
    }
  }

  const position = getSuggestionPosition()

  // Calculate position for SObject loader
  const getSObjectLoaderPosition = () => {
    if (!textareaRef.current || !queryContext?.sobject) return { top: 0, left: 0 }
    
    const textarea = textareaRef.current
    const fromMatch = value.toUpperCase().match(/FROM\s+(\w+)/i)
    if (!fromMatch) return { top: 0, left: 0 }
    
    const fromIndex = value.toUpperCase().indexOf('FROM')
    const sobjectStart = fromIndex + 5 // "FROM ".length
    const sobjectEnd = sobjectStart + queryContext.sobject.length
    
    const lines = value.substring(0, sobjectEnd).split('\n')
    const currentLine = lines.length - 1
    const lineStart = value.substring(0, sobjectEnd).lastIndexOf('\n') + 1
    const columnStart = sobjectEnd - lineStart
    
    const computedStyle = window.getComputedStyle(textarea)
    const fontSize = parseFloat(computedStyle.fontSize)
    const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2
    const fontFamily = computedStyle.fontFamily
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return { top: 0, left: 0 }
    
    context.font = `${fontSize}px ${fontFamily}`
    const textBeforeSObject = value.substring(lineStart, sobjectEnd)
    const textWidth = context.measureText(textBeforeSObject).width
    
    // Account for padding and borders
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0
    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0
    
    return {
      top: currentLine * lineHeight + paddingTop + borderTop + 2,
      left: textWidth + paddingLeft + borderLeft + 4
    }
  }

  const loaderPosition = getSObjectLoaderPosition()

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onSelect={handleCursorChange}
        onKeyUp={handleCursorChange}
        onKeyDown={handleKeyDown}
        onMouseUp={handleCursorChange}
        placeholder={placeholder}
        className={`min-h-[100px] font-mono ${className}`}
        style={{ 
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'transparent',
          color: 'transparent',
          caretColor: 'black'
        }}
      />
      
      {/* Syntax highlighting overlay */}
      <SOQLSyntaxOverlay
        query={value}
        textareaRef={textareaRef}
        className="z-1"
      />
      
      {/* SObject loader */}
      {isLoadingSObject && queryContext?.sobject && (
        <div 
          className="absolute z-20 pointer-events-none"
          style={{
            top: `${loaderPosition.top}px`,
            left: `${loaderPosition.left}px`,
          }}
        >
          <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
        </div>
      )}
      
      {/* Field validation overlay */}
      <FieldValidationOverlay
        query={value}
        sobjectName={queryContext?.sobject}
        textareaRef={textareaRef}
        className="z-10"
        autoCompleteEnabled={autoCompleteEnabled}
      />
      
      {autoCompleteEnabled && showSuggestions && queryContext && (
        <div 
          className="absolute z-50"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            minWidth: '300px'
          }}
        >
          <InlineSuggestions
            query={parsedRelationshipContext?.currentField || currentWord}
            onSelect={handleSelect}
            onNavigateToRelationship={handleNavigateToRelationship}
            onNavigateToBreadcrumb={handleNavigateToBreadcrumb}
            type={queryContext.context === 'FROM' ? 'sobject' : 'field'}
            sobjectName={currentSObject || queryContext.sobject}
            relationshipPath={parsedRelationshipContext?.relationshipPath || relationshipPath}
            breadcrumbs={parsedRelationshipContext?.relationshipPath || breadcrumbs}
            placeholder={queryContext.context === 'FROM' ? "Search objects..." : "Search fields..."}
          />
        </div>
      )}
    </div>
  )
}
