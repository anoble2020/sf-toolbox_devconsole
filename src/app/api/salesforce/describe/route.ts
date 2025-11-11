import { NextRequest, NextResponse } from 'next/server'
import { updateApiLimitsFromHeaders } from '@/lib/salesforce'

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Get instance URL from query parameters
    const { searchParams } = new URL(request.url)
    const instance_url = searchParams.get('instance_url')
    
    if (!instance_url) {
      return NextResponse.json({ error: 'instance_url parameter required' }, { status: 400 })
    }

    // Get global describe
    const response = await fetch(`${instance_url}/services/data/v60.0/sobjects/`, {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
    })

    updateApiLimitsFromHeaders(response.headers)

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.message || 'Failed to fetch global describe' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching global describe:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
