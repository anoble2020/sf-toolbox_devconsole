'use client'

import { Scroll, Flag, FlaskConical, Search, Play, Github, Coffee, Telescope, Home, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import UserNav from '@/components/UserNav'
import { ApiLimits } from '@/components/ApiLimits'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { storage } from '@/lib/storage'

interface LayoutProps {
    children: React.ReactNode
}

interface UserInfo {
    username: string
    orgDomain: string
    orgId: string
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [mounted, setMounted] = useState(false)
    const [currentDomain, setCurrentDomain] = useState<string | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showText, setShowText] = useState(true)

    // Helper function to build URLs with org parameter
    const getHref = (path: string) => {
        if (!mounted) return path // Return plain path during SSR
        return currentDomain && !path.startsWith('/auth')
            ? `${path}?org=${encodeURIComponent(currentDomain)}`
            : path
    }

    useEffect(() => {
        setMounted(true)
        const domain = storage.getCurrentDomain()
        setCurrentDomain(domain)
    }, [])

    useEffect(() => {
        // Skip for auth-related pages
        if (pathname.startsWith('/auth')) {
            return
        }

        const currentDomain = storage.getCurrentDomain()
        if (currentDomain) {
            try {
                // Always ensure org parameter is in URL
                const currentParams = new URLSearchParams(searchParams.toString())
                const orgFromUrl = currentParams.get('org')

                if (!orgFromUrl && !pathname.startsWith('/auth')) {
                    // Replace the current URL with org parameter
                    const newUrl = `${pathname}?org=${encodeURIComponent(currentDomain)}`
                    router.replace(newUrl)
                }

                // Set user info
                const domainUserInfo = storage.getFromDomain(currentDomain, 'user_info')
                if (domainUserInfo) {
                    setUserInfo({
                        username: domainUserInfo.username,
                        orgDomain: domainUserInfo.orgDomain,
                        orgId: domainUserInfo.orgId
                    })
                }
            } catch (e: unknown) {
                console.error('Failed to get user info:', e)
            }
        }
    }, [pathname, searchParams, router])

    // Force org parameter on initial load and navigation
    useEffect(() => {
        if (!pathname.startsWith('/auth')) {
            const currentDomain = storage.getCurrentDomain()
            const currentParams = new URLSearchParams(searchParams.toString())
            const orgFromUrl = currentParams.get('org')

            if (currentDomain && !orgFromUrl) {
                const newUrl = `${pathname}?org=${encodeURIComponent(currentDomain)}`
                router.replace(newUrl)
            }
        }
    }, [pathname, searchParams, router])

    // Handle text visibility during expand animation
    useEffect(() => {
        if (isCollapsed) {
            // Hide text immediately when collapsing
            setShowText(false)
        } else {
            // Delay showing text until after animation completes (300ms)
            const timer = setTimeout(() => {
                setShowText(true)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [isCollapsed])

    const menuItems = [
        { name: 'Dashboard', path: '/devconsole/dashboard', icon: Home },
        { name: 'Logs', path: '/devconsole/logs', icon: Scroll },
        { name: 'Trace Flags', path: '/devconsole/trace-flags', icon: Flag },
        { name: 'Query', path: '/devconsole/query', icon: Search },
        { name: 'Execute', path: '/devconsole/execute', icon: Play },
        { name: 'Tests', path: '/devconsole/tests', icon: FlaskConical },
        { name: 'Explore', path: '/devconsole/explore', icon: Telescope },
    ]

    return (
        <div className="h-screen flex">
            {/* Fixed sidebar */}
            <aside className={cn(
                'fixed inset-y-0 left-0 flex flex-col bg-background border-r border-border z-50 transition-all duration-200',
                isCollapsed ? 'w-16' : 'w-64'
            )}>
                {/* Logo section */}
                <div className={cn(
                    'h-16 flex flex-col justify-center border-b border-border transition-all duration-200',
                    isCollapsed ? 'px-2' : 'px-5'
                )}>
                    <Link href="/" className={cn(
                        'flex items-center hover:opacity-80 transition-opacity',
                        isCollapsed ? 'justify-center mt-2' : 'mt-2'
                    )}>
                        <img src="/icon_128_purp.png" alt="apex toolbox" className={cn(
                            'w-8 h-8 transition-all duration-300',
                            isCollapsed ? 'mb-0 mr-0' : 'mb-6 mr-2'
                        )} />
                        {!isCollapsed && (
                            <span className={cn(
                                'text-xl font-semibold transition-opacity duration-100',
                                showText ? 'opacity-100' : 'opacity-0'
                            )}>
                                sf toolbox
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 -mt-1 ml-0">dev console v0.0.1</div>
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={cn(
                    'flex-1 pt-6 bg-sidebar-background transition-all duration-200',
                    isCollapsed ? 'px-2' : 'px-3'
                )}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={getHref(item.path)}
                            className={cn(
                                'flex items-center rounded-md mb-1 text-sm font-weight-[400] transition-all duration-200',
                                isCollapsed ? 'px-2 py-1.5 justify-center' : 'px-3 py-1.5',
                                pathname === item.path
                                    ? 'bg-[#e1e1e1] text-gray-900 dark:bg-gray-600 dark:text-gray-100'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-100',
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon className={cn(
                                'transition-all duration-200',
                                isCollapsed ? 'w-4 h-4' : 'w-4 h-4 mr-3'
                            )} />
                            {!isCollapsed && (
                                <span className={cn(
                                    'transition-opacity duration-100',
                                    showText ? 'opacity-100' : 'opacity-0'
                                )}>
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Disclaimer and links */}
                {!isCollapsed && (
                    <div className={cn(
                        'mt-auto p-4 border-t border-border transition-opacity duration-160',
                        showText ? 'opacity-100' : 'opacity-0'
                    )}>
                        <p className="text-[11px] text-gray-500 dark:text-gray-500 mb-4 leading-tight">
                            These tools are not created, supported or endorsed by Salesforce.com. Use at your own risk and
                            discretion.
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href="https://github.com/anoble2020/sf-toolbox"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm"
                            >
                                <Github className="w-4 h-4" />
                                <span className="text-xs">View project on GitHub</span>
                            </a>
                            <a
                                href="https://buymeacoffee.com/alexandernoble"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 text-sm"
                            >
                                <Coffee className="w-4 h-4" />
                                <span className="text-xs">Buy me a coffee</span>
                            </a>
                        </div>
                    </div>
                )}

                {/* Collapse toggle button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute top-16 -right-3 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-50 shadow-sm"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </aside>

            {/* Main content wrapper */}
            <div className={cn(
                'flex-1 flex flex-col min-w-0 transition-all duration-200',
                isCollapsed ? 'ml-16' : 'ml-64'
            )}>
                {/* Fixed header */}
                <header className={cn(
                    'h-16 fixed top-0 right-0 border-b border-border px-4 flex items-center justify-between bg-background transition-all duration-200',
                    isCollapsed ? 'left-16' : 'left-64'
                )}>
                    <div className="flex-none">
                        <ApiLimits />
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserNav
                            username={userInfo?.username || ''}
                            orgDomain={userInfo?.orgDomain || ''}
                            orgId={userInfo?.orgId || ''}
                        />
                    </div>
                </header>

                {/* Scrollable content area */}
                <main className="mt-16 flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}