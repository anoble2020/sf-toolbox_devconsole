import { SObjectInfo, SObjectDescribe, FieldInfo, CompletionItem } from '@/types/soql'
import { storage } from '@/lib/storage'
import { refreshAccessToken } from '@/lib/auth'

class SObjectService {
  private sobjectsCache: Map<string, SObjectInfo> = new Map()
  private fieldsCache: Map<string, FieldInfo[]> = new Map()
  private describeCache: Map<string, SObjectDescribe> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private loadingSObjects: Set<string> = new Set()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  async getSObjects(): Promise<SObjectInfo[]> {
    // Get current domain for cache key
    const currentDomain = storage.getCurrentDomain()
    if (!currentDomain) {
      console.error('No current domain found')
      return []
    }

    const cacheKey = `global_describe_${currentDomain}`
    const now = Date.now()
    
    if (this.cacheExpiry.get(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      return Array.from(this.sobjectsCache.values())
    }

    try {
      const refreshToken = storage.getFromDomain(currentDomain, 'refresh_token')
      if (!refreshToken) {
        console.error('No refresh token found')
        return []
      }

      // Get access token and instance URL
      let access_token, instance_url
      try {
        const tokenResult = await refreshAccessToken(refreshToken)
        if (!tokenResult) {
          console.error('Failed to refresh access token')
          return []
        }
        access_token = tokenResult.access_token
        instance_url = tokenResult.instance_url
      } catch (error) {
        console.error('Error refreshing access token:', error)
        return []
      }

      let response
      try {
        response = await fetch(`/api/salesforce/tooling/entity-definition?instance_url=${encodeURIComponent(instance_url)}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      } catch (fetchError) {
        console.error('Tooling API fetch failed:', fetchError)
        console.log('Falling back to regular describe API...')
        
        // Fallback to regular describe API
        const fallbackResponse = await fetch(`/api/salesforce/describe?instance_url=${encodeURIComponent(instance_url)}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        
        if (!fallbackResponse.ok) {
          const fallbackError = await fallbackResponse.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Fallback API Error:', fallbackResponse.status, fallbackError)
          throw new Error(`Failed to fetch SObjects: ${fallbackResponse.status} ${fallbackError.error || 'Unknown error'}`)
        }
        
        const fallbackData = await fallbackResponse.json()
        const sobjects = fallbackData.sobjects || []
        
        // Clear and repopulate cache with fallback data
        this.sobjectsCache.clear()
        sobjects.forEach((sobject: SObjectInfo) => {
          if (sobject && sobject.name && sobject.queryable) {
            this.sobjectsCache.set(sobject.name, sobject)
          }
        })
        
        this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION)
        return Array.from(this.sobjectsCache.values())
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Tooling API Error:', response.status, errorData)
        
        // Fallback to regular describe API if Tooling API fails
        console.log('Falling back to regular describe API...')
        const fallbackResponse = await fetch(`/api/salesforce/describe?instance_url=${encodeURIComponent(instance_url)}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        
        if (!fallbackResponse.ok) {
          const fallbackError = await fallbackResponse.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Fallback API Error:', fallbackResponse.status, fallbackError)
          throw new Error(`Failed to fetch SObjects: ${fallbackResponse.status} ${fallbackError.error || 'Unknown error'}`)
        }
        
        const fallbackData = await fallbackResponse.json()
        const sobjects = fallbackData.sobjects || []
        
        // Clear and repopulate cache with fallback data
        this.sobjectsCache.clear()
        sobjects.forEach((sobject: SObjectInfo) => {
          if (sobject && sobject.name && sobject.queryable) {
            this.sobjectsCache.set(sobject.name, sobject)
          }
        })
        
        this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION)
        return Array.from(this.sobjectsCache.values())
      }
      
      const data = await response.json()
      console.log('EntityDefinition response:', data)
      
      const sobjects = data.records || []
      
      if (!Array.isArray(sobjects)) {
        console.error('Invalid response format - sobjects is not an array:', data)
        throw new Error('Invalid response format from API')
      }
      
      // Clear and repopulate cache
      this.sobjectsCache.clear()
      sobjects.forEach((entity: any) => {
        if (entity && entity.QualifiedApiName) {
          // Map Tooling API EntityDefinition to SObjectInfo format
          const sobject: SObjectInfo = {
            name: entity.QualifiedApiName,
            label: entity.Label,
            labelPlural: entity.Label, // Tooling API doesn't have plural, use same as label
            custom: entity.QualifiedApiName.endsWith('__c'),
            queryable: true, // We already filtered for IsQueryable = true
            searchable: true,
            retrieveable: true,
            createable: false, // Tooling API doesn't provide this info
            updateable: false,
            deletable: false,
            undeletable: false,
            mergeable: false,
            replicateable: false,
            triggerable: false,
            deprecatedAndHidden: false, // Tooling API doesn't have this field
            activateable: false,
            layoutable: false,
            customSetting: false,
            compactLayoutable: false,
            urls: {
              sobject: '',
              describe: '',
              rowTemplate: ''
            }
          }
          this.sobjectsCache.set(sobject.name, sobject)
        }
      })
      
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION)
      return Array.from(this.sobjectsCache.values())
    } catch (error) {
      console.error('Error fetching SObjects:', error)
      // Return cached data if available, otherwise empty array
      const cachedSObjects = Array.from(this.sobjectsCache.values())
      if (cachedSObjects.length > 0) {
        console.log('Returning cached SObjects due to error')
        return cachedSObjects
      }
      return []
    }
  }

  async getSObjectDescribe(sobjectName: string): Promise<SObjectDescribe | null> {
    const now = Date.now()
    
    if (this.describeCache.has(sobjectName) && 
        this.cacheExpiry.get(`describe_${sobjectName}`) && 
        this.cacheExpiry.get(`describe_${sobjectName}`)! > now) {
      return this.describeCache.get(sobjectName)!
    }

    // Check if already loading
    if (this.loadingSObjects.has(sobjectName)) {
      return null
    }

    this.loadingSObjects.add(sobjectName)

    try {
      // Get current domain and refresh token from storage
      const currentDomain = storage.getCurrentDomain()
      if (!currentDomain) {
        console.error('No current domain found')
        return null
      }

      const refreshToken = storage.getFromDomain(currentDomain, 'refresh_token')
      if (!refreshToken) {
        console.error('No refresh token found')
        return null
      }

      // Get access token and instance URL
      let access_token, instance_url
      try {
        const tokenResult = await refreshAccessToken(refreshToken)
        if (!tokenResult) {
          console.error('Failed to refresh access token')
          return null
        }
        access_token = tokenResult.access_token
        instance_url = tokenResult.instance_url
      } catch (error) {
        console.error('Error refreshing access token:', error)
        return null
      }

      const response = await fetch(`/api/salesforce/tooling/field-definition?instance_url=${encodeURIComponent(instance_url)}&entity_name=${encodeURIComponent(sobjectName)}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      if (!response.ok) {
        console.error(`FieldDefinition API failed for ${sobjectName}, falling back to describe API...`)
        
        // Fallback to regular describe API
        const fallbackResponse = await fetch(`/api/salesforce/describe/${sobjectName}?instance_url=${encodeURIComponent(instance_url)}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to fetch describe for ${sobjectName}`)
        }
        
        const describe = await fallbackResponse.json()
        this.describeCache.set(sobjectName, describe)
        this.cacheExpiry.set(`describe_${sobjectName}`, now + this.CACHE_DURATION)
        
        // Also cache the fields separately for easier access
        this.fieldsCache.set(sobjectName, describe.fields || [])
        
        return describe
      }
      
      const data = await response.json()
      const fieldDefinitions = data.records || []
      
      
      // Map Tooling API FieldDefinition to FieldInfo format
      const fields: FieldInfo[] = fieldDefinitions.map((field: any) => ({
        name: field.QualifiedApiName,
        label: field.Label,
        type: field.DataType,
        unique: false,
        nillable: field.IsNillable,
        caseSensitive: false,
        externalId: false,
        idLookup: false,
        createable: false,
        updateable: false,
        sortable: false,
        filterable: false,
        groupable: false,
        custom: field.IsCustom,
        calculated: false,
        restrictedPicklist: false,
        nameField: false,
        autoNumber: false,
        byteLength: 0,
        displayLocationInDecimal: false,
        encrypted: false,
        htmlFormatted: false,
        dependentPicklist: false,
        deprecatedAndHidden: false,
        relationshipName: field.RelationshipName,
        relationshipOrder: 0,
        restrictedDelete: false,
        writeRequiresMasterRead: false,
        defaultedOnCreate: false,
        isHighScaleNumber: false,
        isHtmlFormatted: false,
        isNameField: false,
        isSortable: false,
        isUnique: false,
        isWriteRequiresMasterRead: false,
        length: 0,
        precision: 0,
        scale: 0,
        soapType: field.DataType,
        referenceTo: field.ReferenceTo ? (Array.isArray(field.ReferenceTo) ? field.ReferenceTo : field.ReferenceTo.split(',')) : undefined
      }))
      
      // Create a mock describe object for compatibility
      const describe: SObjectDescribe = {
        name: sobjectName,
        label: sobjectName,
        labelPlural: sobjectName,
        custom: sobjectName.endsWith('__c'),
        queryable: true,
        searchable: true,
        retrieveable: true,
        createable: false,
        updateable: false,
        deletable: false,
        undeletable: false,
        mergeable: false,
        replicateable: false,
        triggerable: false,
        deprecatedAndHidden: false,
        activateable: false,
        layoutable: false,
        customSetting: false,
        compactLayoutable: false,
        fields: fields,
        urls: {
          sobject: '',
          describe: '',
          rowTemplate: ''
        }
      }
      
      this.describeCache.set(sobjectName, describe)
      this.cacheExpiry.set(`describe_${sobjectName}`, now + this.CACHE_DURATION)
      
      // Also cache the fields separately for easier access
      this.fieldsCache.set(sobjectName, fields)
      
      return describe
    } catch (error) {
      console.error(`Error fetching describe for ${sobjectName}:`, error)
      return this.describeCache.get(sobjectName) || null
    } finally {
      this.loadingSObjects.delete(sobjectName)
    }
  }

  isLoadingSObject(sobjectName: string): boolean {
    return this.loadingSObjects.has(sobjectName)
  }

  async getFields(sobjectName: string): Promise<FieldInfo[]> {
    const now = Date.now()
    
    if (this.fieldsCache.has(sobjectName) && 
        this.cacheExpiry.get(`fields_${sobjectName}`) && 
        this.cacheExpiry.get(`fields_${sobjectName}`)! > now) {
      return this.fieldsCache.get(sobjectName)!
    }

    const describe = await this.getSObjectDescribe(sobjectName)
    if (describe) {
      const fields = describe.fields || []
      this.fieldsCache.set(sobjectName, fields)
      this.cacheExpiry.set(`fields_${sobjectName}`, now + this.CACHE_DURATION)
      return fields
    }

    return []
  }

  async getSObjectCompletions(query: string): Promise<CompletionItem[]> {
    const sobjects = await this.getSObjects()
    
    return sobjects
      .filter(sobject => 
        sobject.queryable && 
        !sobject.deprecatedAndHidden &&
        sobject.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(sobject => ({
        label: sobject.label,
        value: sobject.name,
        type: 'sobject' as const,
        description: sobject.labelPlural,
        insertText: sobject.name,
        sortText: sobject.name
      }))
      .sort((a, b) => a.sortText!.localeCompare(b.sortText!))
  }

  async getFieldCompletions(sobjectName: string, query: string, relationshipPath: string[] = []): Promise<CompletionItem[]> {
    // If we're navigating through relationships, get fields for the current SObject
    const targetSObject = sobjectName
    const fields = await this.getFields(targetSObject)
    
    if (!fields.length) {
      return []
    }

    // Get relationship fields (lookup/master-detail fields)
    const relationshipFields = fields.filter(field => 
      field.type === 'reference' && 
      field.relationshipName && 
      field.referenceTo && 
      field.referenceTo.length > 0
    )

    // If we're in a relationship context (relationshipPath.length > 0), only show regular fields
    // not more relationship fields
    if (relationshipPath.length > 0) {
      const queryLower = query.toLowerCase()
      const filteredFields = fields.filter(field => 
        field.type !== 'reference' && // Exclude relationship fields
        (field.name.toLowerCase().includes(queryLower) || 
         field.label.toLowerCase().includes(queryLower)) &&
        !field.deprecatedAndHidden
      )

      return filteredFields.map(field => ({
        label: field.label,
        value: field.name,
        type: 'field' as const,
        description: `${field.type}${field.nillable ? ' (nullable)' : ''}`,
        insertText: field.name,
        sortText: field.name
      })).sort((a, b) => {
        // Sort by exact matches first, then by starts with, then alphabetically
        const aExact = a.value.toLowerCase() === queryLower || a.label.toLowerCase() === queryLower
        const bExact = b.value.toLowerCase() === queryLower || b.label.toLowerCase() === queryLower
        
        if (aExact && !bExact) return -1
        if (!aExact && bExact) return 1
        
        const aStartsWith = a.value.toLowerCase().startsWith(queryLower) || a.label.toLowerCase().startsWith(queryLower)
        const bStartsWith = b.value.toLowerCase().startsWith(queryLower) || b.label.toLowerCase().startsWith(queryLower)
        
        if (aStartsWith && !bStartsWith) return -1
        if (!aStartsWith && bStartsWith) return 1
        
        return a.sortText!.localeCompare(b.sortText!)
      })
    }

    // If query is empty, return all fields including relationship fields
    if (!query.trim()) {
      const fieldCompletions = fields
        .filter(field => !field.deprecatedAndHidden)
        .map(field => ({
          label: field.label,
          value: field.name,
          type: 'field' as const,
          description: `${field.type}${field.nillable ? ' (nullable)' : ''}`,
          insertText: field.name,
          sortText: field.name
        }))

      // Add relationship field completions
      const relationshipCompletions = relationshipFields
        .filter(field => !field.deprecatedAndHidden)
        .map(field => {
          const referencedSObject = field.referenceTo?.[0]
          return {
            label: `${field.label} (${field.relationshipName})`,
            value: field.relationshipName!,
            type: 'relationship' as const,
            description: `Reference to ${field.referenceTo?.join(', ')}`,
            insertText: field.relationshipName!,
            sortText: field.relationshipName!,
            // Add the referenced SObject name for navigation
            referencedSObject: referencedSObject // Use the first referenced SObject
          }
        })

      return [...fieldCompletions, ...relationshipCompletions]
        .sort((a, b) => a.sortText!.localeCompare(b.sortText!))
    }

    const queryLower = query.toLowerCase()
    const filteredFields = fields.filter(field => 
      (field.name.toLowerCase().includes(queryLower) || 
       field.label.toLowerCase().includes(queryLower)) &&
      !field.deprecatedAndHidden
    )

    const filteredRelationshipFields = relationshipFields.filter(field => 
      (field.relationshipName?.toLowerCase().includes(queryLower) ||
       field.label.toLowerCase().includes(queryLower)) &&
      !field.deprecatedAndHidden
    )

    const fieldResults = filteredFields.map(field => ({
      label: field.label,
      value: field.name,
      type: 'field' as const,
      description: `${field.type}${field.nillable ? ' (nullable)' : ''}`,
      insertText: field.name,
      sortText: field.name
    }))

    const relationshipResults = filteredRelationshipFields.map(field => {
      const referencedSObject = field.referenceTo?.[0]
      return {
        label: `${field.label} (${field.relationshipName})`,
        value: field.relationshipName!,
        type: 'relationship' as const,
        description: `Reference to ${field.referenceTo?.join(', ')}`,
        insertText: field.relationshipName!,
        sortText: field.relationshipName!,
        // Add the referenced SObject name for navigation
        referencedSObject: referencedSObject // Use the first referenced SObject
      }
    })

    const allResults = [...fieldResults, ...relationshipResults]
    
    return allResults.sort((a, b) => {
      // Sort by exact matches first, then by starts with, then alphabetically
      const aExact = a.value.toLowerCase() === queryLower || a.label.toLowerCase() === queryLower
      const bExact = b.value.toLowerCase() === queryLower || b.label.toLowerCase() === queryLower
      
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      const aStartsWith = a.value.toLowerCase().startsWith(queryLower) || a.label.toLowerCase().startsWith(queryLower)
      const bStartsWith = b.value.toLowerCase().startsWith(queryLower) || b.label.toLowerCase().startsWith(queryLower)
      
      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1
      
      return a.sortText!.localeCompare(b.sortText!)
    })
  }

  async getRelationshipCompletions(sobjectName: string, relationshipPath: string[], query: string): Promise<CompletionItem[]> {
    const fields = await this.getFields(sobjectName)
    
    if (!fields.length) {
      return []
    }

    // Find reference fields that match the relationship path
    const referenceFields = fields.filter(field => 
      field.type === 'reference' &&
      field.relationshipName &&
      field.relationshipName.toLowerCase().includes(query.toLowerCase()) &&
      !field.deprecatedAndHidden
    )

    return referenceFields.map(field => ({
      label: field.label,
      value: field.relationshipName!,
      type: 'relationship' as const,
      description: `Reference to ${field.referenceTo?.join(', ')}`,
      insertText: field.relationshipName!,
      sortText: field.relationshipName!
    }))
    .sort((a, b) => a.sortText!.localeCompare(b.sortText!))
  }

  async validateFieldsInQuery(query: string, sobjectName: string): Promise<{ field: string; isValid: boolean; position: { start: number; end: number } }[]> {
    if (!sobjectName) return []

    const fields = await this.getFields(sobjectName)
    const fieldNames = new Set(fields.map(f => f.name.toLowerCase()))
    
    // Extract field names from SELECT clause
    const selectMatch = query.match(/SELECT\s+([\s\S]*?)\s+FROM/i)
    if (!selectMatch) return []

    const fieldList = selectMatch[1]
    const results: { field: string; isValid: boolean; position: { start: number; end: number } }[] = []
    
    // Split by commas and process each field individually
    const fieldParts = fieldList.split(',').map(part => part.trim())
    let currentPosition = selectMatch.index! + 6 // Start after "SELECT"
    
    for (const part of fieldParts) {
      if (!part) {
        currentPosition += 1 // Account for comma
        continue
      }
      
      // Find the actual field name in this part (skip whitespace)
      const fieldMatch = part.match(/(\w+(?:\.\w+)*)/)
      if (fieldMatch) {
        const fieldName = fieldMatch[1]
        const fieldStart = currentPosition + part.indexOf(fieldName)
        const fieldEnd = fieldStart + fieldName.length
        
        // Check if it's a relationship field (contains dot)
        if (fieldName.includes('.')) {
          const [relationshipName] = fieldName.split('.')
          const relationshipField = fields.find(f => f.relationshipName?.toLowerCase() === relationshipName.toLowerCase())
          results.push({
            field: fieldName,
            isValid: !!relationshipField,
            position: { start: fieldStart, end: fieldEnd }
          })
        } else {
          results.push({
            field: fieldName,
            isValid: fieldNames.has(fieldName.toLowerCase()),
            position: { start: fieldStart, end: fieldEnd }
          })
        }
      }
      
      currentPosition += part.length + 1 // +1 for comma
    }
    
    return results
  }

  async resolveSObjectFromRelationshipPath(baseSObject: string, relationshipPath: string[]): Promise<string> {
    if (relationshipPath.length === 0) {
      return baseSObject
    }

    let currentSObject = baseSObject
    
    for (const relationshipName of relationshipPath) {
      // Get fields for the current SObject
      const fields = await this.getFields(currentSObject)
      
      // Find the relationship field
      const relationshipField = fields.find(field => 
        field.relationshipName === relationshipName && 
        field.type === 'reference' &&
        field.referenceTo &&
        field.referenceTo.length > 0
      )
      
      if (!relationshipField || !relationshipField.referenceTo) {
        // If we can't find the relationship, return the base SObject
        return baseSObject
      }
      
      // Move to the referenced SObject (use the first one if multiple)
      currentSObject = relationshipField.referenceTo[0]
    }
    
    return currentSObject
  }

  clearCache(): void {
    this.sobjectsCache.clear()
    this.fieldsCache.clear()
    this.describeCache.clear()
    this.cacheExpiry.clear()
  }
}

export const sobjectService = new SObjectService()
