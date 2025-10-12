'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { storage } from '@/lib/storage'

export default function DevConsolePage() {
    const router = useRouter()

    useEffect(() => {
        console.log('DevConsole page mounted')
        console.log('Environment:', process.env.NODE_ENV)
        console.log('BYPASS_AUTH:', process.env.NEXT_PUBLIC_BYPASS_AUTH)
        
        const currentDomain = storage.getCurrentDomain()
        console.log('Current domain:', currentDomain)
        
        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            console.log('Timeout reached, redirecting to auth')
            router.push('/auth?app=devconsole');
        }, 5000); // 5 second timeout
        
        let hasValidAuth = false
        if (currentDomain) {
            const refreshToken = storage.getFromDomain(currentDomain, 'refresh_token')
            const userInfo = storage.getFromDomain(currentDomain, 'user_info')
            console.log('Auth check:', { 
                hasRefreshToken: !!refreshToken, 
                hasUserInfo: !!userInfo,
                refreshTokenLength: refreshToken ? refreshToken.length : 0,
                currentDomain
            })
            
            hasValidAuth = !!refreshToken && !!userInfo
        } else {
            // If no current domain, check if there are any connected orgs
            const connectedOrgs = storage.getAllConnectedOrgs()
            console.log('No current domain, checking connected orgs:', connectedOrgs)
            
            if (connectedOrgs.length > 0) {
                // Use the most recently accessed org
                const mostRecentOrg = connectedOrgs[0]
                console.log('Using most recent org:', mostRecentOrg)
                storage.setCurrentDomain(mostRecentOrg.orgDomain)
                hasValidAuth = true
            }
        }

        console.log('hasValidAuth', hasValidAuth)

        const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
        console.log('bypassAuth', bypassAuth)
    
        if (hasValidAuth || bypassAuth) {
            console.log('Redirecting to dashboard')
            clearTimeout(timeoutId)
            router.push('/devconsole/dashboard');
        } else {
            console.log('Redirecting to auth')
            clearTimeout(timeoutId)
            router.push('/auth?app=devconsole');
        }
        
        // Cleanup timeout on unmount
        return () => clearTimeout(timeoutId)
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading DevConsole...</span>
        </div>
    )
}
