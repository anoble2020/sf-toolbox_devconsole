'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { storage } from '@/lib/storage'
import { toast } from 'sonner'
import { ConnectedOrg } from '@/lib/types'

export default function CallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    )
}

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const processAuth = async () => {
            const code = searchParams.get('code')
            const state = searchParams.get('state')
            
            try {
                console.log('Processing auth with code:', code)
                
                if (!code || !state) {
                    throw new Error('No authorization code or state found in URL')
                }

                const response = await fetch('/api/auth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        state: state
                    },
                    body: JSON.stringify({ code }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(`Token exchange failed: ${errorData.error || response.statusText}`)
                }

                const data = await response.json()
                console.log('Received auth data:', { ...data, tokens: '[REDACTED]' })

                if (data.error) throw new Error(data.error)
                if (!data.tokens?.refresh_token || !data.user) {
                    throw new Error('Invalid response: Missing tokens or user data')
                }

                const domain = data.user.orgDomain
                if (!domain) throw new Error('Invalid response: Missing orgDomain')

                // Create new org object
                const newOrg: ConnectedOrg = {
                    orgId: data.user.orgId,
                    orgDomain: domain,
                    username: data.user.username,
                    environmentType: data.user.environmentType,
                    refreshToken: data.tokens.refresh_token,
                    lastAccessed: new Date().toISOString()
                }

                console.log('Setting up new org:', { ...newOrg, refreshToken: '[REDACTED]' })

                // First set the current domain
                storage.setCurrentDomain(domain)

                // Then store the refresh token
                storage.setForDomain(domain, 'refresh_token', data.tokens.refresh_token)
                
                // Set the cookie
                document.cookie = `sf_refresh_token=${data.tokens.refresh_token}; path=/; max-age=31536000`

                // Add the connected org
                storage.addConnectedOrg(newOrg)
                
                // Store user info
                storage.setForDomain(domain, 'user_info', data.user)

                // Get the app parameter from the state or default to devconsole
                let app = 'devconsole' // Default fallback
                if (state) {
                    try {
                        const parsedState = JSON.parse(decodeURIComponent(state))
                        app = parsedState.app || 'devconsole'
                        console.log('Parsed state:', parsedState, 'App:', app)
                    } catch (e) {
                        console.error('Failed to parse state:', state, e)
                        app = 'devconsole'
                    }
                } else {
                    console.log('No state parameter found, using default app: devconsole')
                }
                
                console.log('Auth setup complete, redirecting to app:', app)
                toast.success('Successfully connected organization')
                
                // Always ensure we redirect to devconsole for now
                const redirectUrl = '/devconsole/dashboard'
                console.log('Final redirect URL:', redirectUrl)
                window.location.href = redirectUrl
            } catch (error) {
                console.error('Auth callback error:', error)
                toast.error(error instanceof Error ? error.message : 'Authentication failed')
                // Try to get the app from state, fallback to devconsole
                let app = 'devconsole' // Default fallback
                if (state) {
                    try {
                        const parsedState = JSON.parse(decodeURIComponent(state))
                        app = parsedState.app || 'devconsole'
                    } catch (e) {
                        console.error('Failed to parse state in error handler:', state, e)
                        app = 'devconsole'
                    }
                }
                router.push(`/auth?app=${app}`)
            }
        }

        processAuth()
    }, [router, searchParams])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Completing authentication...</span>
        </div>
    )
}
