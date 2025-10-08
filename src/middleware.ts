import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    console.log('Middleware running for:', request.nextUrl.pathname)
    
    const pathname = request.nextUrl.pathname
    const isAuthPath = pathname.startsWith('/auth')
    const isRootPath = pathname === '/'
    const isDocsPath = pathname.startsWith('/docs')
    const isAboutPath = pathname.startsWith('/about')
    const isDevConsolePath = pathname.startsWith('/devconsole')
    const isApiPath = pathname.startsWith('/api')
    const hasRefreshToken = request.cookies.get('sf_refresh_token')
    const bypassAuth = process.env.BYPASS_AUTH === 'true'

    console.log('Path analysis:', {
        pathname,
        isAuthPath,
        isRootPath,
        isDocsPath,
        isAboutPath,
        isDevConsolePath,
        isApiPath,
        hasRefreshToken: !!hasRefreshToken,
        bypassAuth
    })

    // Allow all public paths and API paths to proceed
    if (isAuthPath || isRootPath || isDocsPath || isAboutPath || isApiPath) {
        console.log('Allowing public/API path:', pathname)
        return NextResponse.next()
    }

    // For devconsole paths, check auth
    if (isDevConsolePath) {
        if (!hasRefreshToken && !bypassAuth) {
            console.log('Redirecting to auth from middleware - no refresh token for devconsole')
            return NextResponse.redirect(new URL('/auth?app=devconsole', request.url))
        }
        console.log('Allowing devconsole path:', pathname)
        return NextResponse.next()
    }

    // For any other protected paths, redirect to auth
    if (!hasRefreshToken && !bypassAuth) {
        console.log('Redirecting to auth from middleware - no refresh token for protected path')
        return NextResponse.redirect(new URL('/auth?app=devconsole', request.url))
    }

    console.log('Allowing path:', pathname)
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|auth_bg_design\\.jpg|icon_128_purp\\.png|.*\\.png$).*)',
    ],
}
