'use client'

import * as React from 'react'
import { Check, ChevronDown, Hash, Calendar, Clock, Mail, Phone, MapPin, User, FileText, Link, ToggleLeft, Image, DollarSign, Percent, Database, GitBranch, Type, List, IdCard, TextSelect, BookOpenText, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CompletionItem } from '@/types/soql'
import { sobjectService } from '@/lib/sobjectService'

// Function to get appropriate icon for field type
const getFieldTypeIcon = (fieldType: string, fieldName: string) => {
  const type = fieldType.toLowerCase()
  const name = fieldName.toLowerCase()
  
  // Special cases based on field name
  if (name.includes('email')) return Mail
  if (name.includes('phone')) return Phone
  if (name.includes('address')) return MapPin
  if (name.includes('name') && !name.includes('username')) return Type
  if (name.includes('amount') || name.includes('price') || name.includes('cost')) return DollarSign
  if (name.includes('percent') || name.includes('rate')) return Percent
  if (name.includes('image') || name.includes('photo') || name.includes('picture')) return Image
  if (name.includes('url') || name.includes('link') || name.includes('website')) return Link
  if (name.includes('description') || name.includes('comment') || name.includes('note')) return FileText
  if (name.includes('active') || name.includes('enabled') || name.includes('flag')) return ToggleLeft
  
  // Type-based mapping
  switch (type) {
    case 'id':
      return IdCard
    case 'string':
    case 'textarea':
      return Type
    case 'longtextarea':
      return TextSelect
    case 'richtext':
      return BookOpenText
    case 'int':
    case 'double':
    case 'currency':
    case 'percent':
      return Hash
    case 'date':
      return Calendar
    case 'datetime':
      return Clock
    case 'boolean':
      return ToggleLeft
    case 'reference':
      return Link
    case 'email':
      return Mail
    case 'phone':
      return Phone
    case 'url':
      return Link
    case 'picklist':
    case 'multipicklist':
      return List
    case 'address':
      return MapPin
    default:
      return Database
  }
}

interface InlineSuggestionsProps {
  query: string
  onSelect: (value: string) => void
  onNavigateToRelationship?: (relationshipName: string, targetSObject?: string) => void
  onNavigateToBreadcrumb?: (index: number) => void
  placeholder?: string
  className?: string
  type: 'sobject' | 'field'
  sobjectName?: string
  relationshipPath?: string[]
  breadcrumbs?: string[]
}

export function InlineSuggestions({
  query,
  onSelect,
  onNavigateToRelationship,
  onNavigateToBreadcrumb,
  placeholder = "Type to search...",
  className,
  type,
  sobjectName,
  relationshipPath = [],
  breadcrumbs = []
}: InlineSuggestionsProps) {
  const [open, setOpen] = React.useState(false)
  const [completions, setCompletions] = React.useState<CompletionItem[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // For field suggestions, allow empty query to show all fields
    if (!query.trim() && type !== 'field') {
      setCompletions([])
      setOpen(false)
      return
    }

    const fetchCompletions = async () => {
      setLoading(true)
      try {
        let items: CompletionItem[] = []
        
        if (type === 'sobject') {
          items = await sobjectService.getSObjectCompletions(query)
        } else if (type === 'field' && sobjectName) {
          // Always use getFieldCompletions - it handles both regular fields and relationship fields
          // When relationshipPath.length > 0, we're showing fields from the related object
          items = await sobjectService.getFieldCompletions(sobjectName, query, relationshipPath)
        }
        setCompletions(items || [])
        setOpen(items.length > 0)
      } catch (error) {
        console.error('Error fetching completions:', error)
        setCompletions([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchCompletions, 150)
    return () => clearTimeout(debounceTimer)
  }, [query, type, sobjectName, relationshipPath, breadcrumbs])

  const handleSelect = (value: string) => {
    onSelect(value)
    setOpen(false)
  }

  // Don't render if no query (except for field type) or no completions
  if ((!query.trim() && type !== 'field') || (!loading && completions.length === 0)) {
    return null
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="pointer-events-none" />
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] p-0 pointer-events-auto" 
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : completions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="p-1">
                {/* Breadcrumb navigation */}
                {breadcrumbs.length > 0 && (
                  <div className="px-2 py-1.5 border-b border-border">
                    <div className="flex items-center text-xs text-muted-foreground">
                      {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              onNavigateToBreadcrumb?.(index)
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            className="hover:text-foreground hover:underline"
                          >
                            {breadcrumb}
                          </button>
                          {index < breadcrumbs.length - 1 && (
                            <ChevronRight className="h-3 w-3 mx-1" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
                
                {completions.map((completion) => {
                  // Get appropriate icon for field type, SObject, or relationship
                  const IconComponent = type === 'field' && completion.description 
                    ? getFieldTypeIcon(completion.description.split(' ')[0], completion.value)
                    : type === 'sobject' 
                    ? Database 
                    : completion.type === 'relationship'
                    ? GitBranch
                    : Database
                  
                  return (
                    <div
                      key={completion.value}
                      onMouseDown={(e) => {
                        // Prevent the mousedown from blurring the textarea
                        e.preventDefault()
                      }}
                      onClick={(e) => {
                        // For relationship fields, navigate instead of selecting
                        if (completion.type === 'relationship' && onNavigateToRelationship) {
                          e.preventDefault()
                          e.stopPropagation()
                          // Pass both the relationship name and the referenced SObject
                          const relationshipName = completion.value
                          const targetSObject = (completion as any).referencedSObject
                          onNavigateToRelationship(relationshipName, targetSObject)
                          return
                        }
                        console.log('Direct click on completion:', completion.value)
                        handleSelect(completion.value)
                      }}
                      className="flex items-center justify-between px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                    >
                      <div className="flex items-center flex-1">
                        <IconComponent className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium truncate">{completion.label}</span>
                            <span className="ml-2 text-xs text-muted-foreground flex-shrink-0">
                              {completion.value}
                            </span>
                          </div>
                          {completion.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {completion.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {completion.type === 'relationship' && onNavigateToRelationship ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              // Pass both the relationship name and the referenced SObject
                              const relationshipName = completion.value
                              const targetSObject = (completion as any).referencedSObject
                              onNavigateToRelationship(relationshipName, targetSObject)
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                            className="p-1 hover:bg-accent rounded"
                          >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ) : (
                          <Check className="h-4 w-4 opacity-0" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
