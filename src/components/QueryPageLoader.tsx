'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { sobjectService } from '@/lib/sobjectService'

interface QueryPageLoaderProps {
  children: React.ReactNode
}

export function QueryPageLoader({ children }: QueryPageLoaderProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Loading SObjects and fields on page load...')
        setIsLoading(true)
        setError(null)
        
        // Pre-load SObjects
        const sobjects = await sobjectService.getSObjects()
        console.log('✅ Loaded SObjects:', sobjects.length)
        
        // Pre-load fields for common SObjects
        /*const commonSObjects = ['Account', 'Contact', 'Lead', 'Opportunity', 'Case', 'User']
        const loadPromises = commonSObjects.map(async (sobjectName) => {
          try {
            await sobjectService.getFields(sobjectName)
            console.log(`✅ Pre-loaded fields for ${sobjectName}`)
          } catch (err) {
            console.warn(`⚠️ Could not pre-load fields for ${sobjectName}:`, err)
          }
        })
        
        await Promise.all(loadPromises)
        console.log('✅ All data loaded successfully')*/  
        setIsLoading(false)
      } catch (err) {
        console.error('❌ Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Loading Query Builder</h3>
          <p className="text-sm text-muted-foreground">
            Fetching SObjects from Salesforce...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Failed to Load Data</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Suggestions may not work properly. Please refresh the page to try again.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
