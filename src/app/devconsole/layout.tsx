'use client'

import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { setNavigationFlag } from '@/lib/devconsoleStore'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Set navigation flag on mount to indicate client-side navigation
        setNavigationFlag()
    }, [])
    
    return <Layout>{children}</Layout>
}
