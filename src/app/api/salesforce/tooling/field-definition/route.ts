import { NextRequest, NextResponse } from 'next/server'
import { updateApiLimitsFromHeaders } from '@/lib/salesforce'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Get instance URL and entity name from query parameters
    const { searchParams } = new URL(request.url)
    const instance_url = searchParams.get('instance_url')
    const entity_name = searchParams.get('entity_name')
    
    if (!instance_url) {
      return NextResponse.json({ error: 'instance_url parameter required' }, { status: 400 })
    }
    
    if (!entity_name) {
      return NextResponse.json({ error: 'entity_name parameter required' }, { status: 400 })
    }

    // Query FieldDefinition using Tooling REST API for the specific entity
    const query = `SELECT QualifiedApiName, Label, DataType, IsNillable, RelationshipName, ReferenceTo, IsCustom FROM FieldDefinition WHERE EntityDefinition.QualifiedApiName = '${entity_name}' ORDER BY QualifiedApiName`
    
    const response = await fetch(`${instance_url}/services/data/v60.0/tooling/query?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    })

    updateApiLimitsFromHeaders(response.headers)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('FieldDefinition API Error:', response.status, error)
      return NextResponse.json({ error: error.message || error.error || 'Failed to fetch FieldDefinition' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
      console.error('Error fetching FieldDefinition:', error)
      return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
