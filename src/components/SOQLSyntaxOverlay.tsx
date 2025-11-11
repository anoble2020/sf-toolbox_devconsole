'use client'

import * as React from 'react'
import { SOQLSyntaxHighlighter } from './SOQLSyntaxHighlighter'

interface SOQLSyntaxOverlayProps {
  query: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  className?: string
}

export function SOQLSyntaxOverlay({ query, textareaRef, className }: SOQLSyntaxOverlayProps) {
  const [textareaStyle, setTextareaStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const computedStyle = window.getComputedStyle(textarea)
    
    // Copy all the relevant styles from the textarea for perfect alignment
    setTextareaStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: computedStyle.padding,
      margin: computedStyle.margin,
      border: computedStyle.border,
      borderRadius: computedStyle.borderRadius,
      outline: 'none',
      fontSize: computedStyle.fontSize,
      fontFamily: computedStyle.fontFamily,
      fontWeight: computedStyle.fontWeight,
      lineHeight: computedStyle.lineHeight,
      letterSpacing: computedStyle.letterSpacing,
      wordSpacing: computedStyle.wordSpacing,
      whiteSpace: computedStyle.whiteSpace,
      overflow: 'hidden',
      backgroundColor: 'transparent',
      color: 'transparent',
      caretColor: 'transparent',
      pointerEvents: 'none',
      zIndex: 1,
      boxSizing: computedStyle.boxSizing as 'border-box' | 'content-box',
    })
  }, [textareaRef])

  if (!textareaRef.current) return null

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={textareaStyle}
    >
      <SOQLSyntaxHighlighter 
        query={query}
        className="whitespace-pre-wrap break-words"
      />
    </div>
  )
}
