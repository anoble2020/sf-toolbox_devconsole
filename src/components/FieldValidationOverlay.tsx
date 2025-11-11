'use client'

import * as React from 'react'
import { sobjectService } from '@/lib/sobjectService'

interface FieldValidation {
  field: string
  isValid: boolean
  position: { start: number; end: number }
}

interface FieldValidationOverlayProps {
  query: string
  sobjectName: string | undefined
  className?: string
  textareaRef?: React.RefObject<HTMLTextAreaElement>
  autoCompleteEnabled?: boolean
}

export function FieldValidationOverlay({ query, sobjectName, className, textareaRef, autoCompleteEnabled = false }: FieldValidationOverlayProps) {
  const [validations, setValidations] = React.useState<FieldValidation[]>([])
  const [isValidating, setIsValidating] = React.useState(false)
  const [lastValidatedSObject, setLastValidatedSObject] = React.useState<string | undefined>()

  React.useEffect(() => {
    // Don't validate if auto-complete is disabled
    if (!autoCompleteEnabled) {
      setValidations([])
      setLastValidatedSObject(undefined)
      return
    }

    if (!sobjectName || !query.includes('SELECT') || !query.includes('FROM')) {
      setValidations([])
      setLastValidatedSObject(undefined)
      return
    }

    // Only validate if SObject name is complete (has space after it)
    // Also ensure it's not just a single character and not currently being typed
    const isSObjectComplete = sobjectName.length > 1 && 
      (query.includes(`${sobjectName} `) || query.includes(`${sobjectName}\n`) || query.endsWith(sobjectName))
    if (!isSObjectComplete) {
      setValidations([])
      setLastValidatedSObject(undefined)
      return
    }

    // Only validate if the SObject has changed or this is the first time
    if (lastValidatedSObject === sobjectName) {
      return
    }

    const validateFields = async () => {
      setIsValidating(true)
      try {
        const results = await sobjectService.validateFieldsInQuery(query, sobjectName)
        setValidations(results)
        setLastValidatedSObject(sobjectName)
      } catch (error) {
        console.error('Error validating fields:', error)
        setValidations([])
      } finally {
        setIsValidating(false)
      }
    }

    // Debounce validation
    const timeoutId = setTimeout(validateFields, 500)
    return () => clearTimeout(timeoutId)
  }, [query, sobjectName, autoCompleteEnabled])

  if (validations.length === 0) {
    return null
  }

  const invalidFields = validations.filter(v => !v.isValid)

  if (invalidFields.length === 0) {
    return null
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {invalidFields.map((validation, index) => {
        if (!textareaRef?.current) return null
        
        const textarea = textareaRef.current
        
        // Calculate position based on character positions
        const lines = query.substring(0, validation.position.start).split('\n')
        const currentLine = lines.length - 1
        const lineStart = query.substring(0, validation.position.start).lastIndexOf('\n') + 1
        
        // Get computed styles from the textarea
        const computedStyle = window.getComputedStyle(textarea)
        const fontSize = parseFloat(computedStyle.fontSize)
        const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2
        const fontFamily = computedStyle.fontFamily
        
        // Create canvas to measure text accurately
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (!context) return null
        
        context.font = `${fontSize}px ${fontFamily}`
        
        // Measure the text before the field to get accurate positioning
        const textBeforeField = query.substring(0, validation.position.start)
        const textBeforeFieldInLine = textBeforeField.substring(lineStart)
        const textWidth = context.measureText(textBeforeFieldInLine).width
        const fieldText = query.substring(validation.position.start, validation.position.end)
        const fieldWidth = context.measureText(fieldText).width
        
        // Calculate position relative to textarea with padding offset
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0
        const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0
        
        const top = currentLine * lineHeight + paddingTop + borderTop
        const left = textWidth + paddingLeft + borderLeft
        const width = fieldWidth

        return (
          <div
            key={index}
            className="absolute bg-red-200/20 border-b border-red-500"
            style={{
              top: `${top}px`,
              left: `${left}px`,
              width: `${width}px`,
              height: `${lineHeight}px`,
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
            }}
            title={`Field '${validation.field}' does not exist on ${sobjectName}`}
          />
        )
      })}
    </div>
  )
}
