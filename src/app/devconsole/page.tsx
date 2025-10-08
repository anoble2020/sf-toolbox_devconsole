'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { storage } from '@/lib/storage'

export default function DevConsolePage() {
    const router = useRouter()

    useEffect(() => {
        console.log('DevConsole page mounted')
        
        const currentDomain = storage.getCurrentDomain()
        console.log('Current domain:', currentDomain)
        
        let hasValidAuth = false
        if (currentDomain) {
            const refreshToken = storage.getFromDomain(currentDomain, 'refresh_token')
            const userInfo = storage.getFromDomain(currentDomain, 'user_info')
            console.log('Auth check:', { 
                hasRefreshToken: !!refreshToken, 
                hasUserInfo: !!userInfo 
            })
            
            hasValidAuth = true
        }

        console.log('hasValidAuth', hasValidAuth)

        const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
    
        if (hasValidAuth || bypassAuth) {
            router.push('/devconsole/dashboard');
        } else {
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
