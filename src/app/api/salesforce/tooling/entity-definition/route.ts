import { NextRequest, NextResponse } from 'next/server'
import { updateApiLimitsFromHeaders } from '@/lib/salesforce'

export async function GET(request: NextRequest) {
  try {
    console.log('EntityDefinition API route called')
    
    // Get authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      console.log('No authorization header')
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Get instance URL from query parameters
    const { searchParams } = new URL(request.url)
    const instance_url = searchParams.get('instance_url')
    
    console.log('Instance URL:', instance_url)
    
    if (!instance_url) {
      console.log('No instance_url parameter')
      return NextResponse.json({ error: 'instance_url parameter required' }, { status: 400 })
    }

    // Query EntityDefinition using Tooling REST API
    const query = `SELECT QualifiedApiName, Label FROM EntityDefinition WHERE IsQueryable = true AND IsCustomizable = true AND IsCustomSetting = false ORDER BY QualifiedApiName LIMIT 2000`
    const toolingUrl = `${instance_url}/services/data/v60.0/tooling/query?q=${encodeURIComponent(query)}`
    
    console.log('Tooling API URL:', toolingUrl)
    console.log('Query:', query)
    
    const response = await fetch(toolingUrl, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    })

    console.log('Tooling API response status:', response.status)

    updateApiLimitsFromHeaders(response.headers)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Tooling API Error:', response.status, error)
      return NextResponse.json({ error: error.message || error.error || 'Failed to fetch EntityDefinition' }, { status: response.status })
    }

    const data = await response.json()
    console.log('Tooling API success, records:', data.records?.length)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching EntityDefinition:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
