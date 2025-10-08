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
        
        let hasValidAuth = false
        if (currentDomain) {
            const refreshToken = storage.getFromDomain(currentDomain, 'refresh_token')
            const userInfo = storage.getFromDomain(currentDomain, 'user_info')
            console.log('Auth check:', { 
                hasRefreshToken: !!refreshToken, 
                hasUserInfo: !!userInfo,
                refreshTokenLength: refreshToken ? refreshToken.length : 0
            })
            
            hasValidAuth = !!refreshToken && !!userInfo
        }

        console.log('hasValidAuth', hasValidAuth)

        const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
        console.log('bypassAuth', bypassAuth)
    
        if (hasValidAuth || bypassAuth) {
            console.log('Redirecting to dashboard')
            router.push('/devconsole/dashboard');
        } else {
            console.log('Redirecting to auth')
            router.push('/auth?app=devconsole');
        }
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading DevConsole...</span>
        </div>
    )
}
