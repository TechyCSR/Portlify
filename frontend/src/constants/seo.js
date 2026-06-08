import {
    BRAND_DESCRIPTION,
    BRAND_KEYWORDS,
    BRAND_NAME_DISPLAY,
    DEFAULT_TITLE,
} from './brand'
import { getSiteStructuredData } from '../utils/seo'

const LANDING_PAGE_JSONLD = getSiteStructuredData()

export const PAGE_SEO = {
    '/': {
        title: DEFAULT_TITLE,
        description: BRAND_DESCRIPTION,
        keywords: BRAND_KEYWORDS,
        robots: 'index, follow',
        jsonLd: LANDING_PAGE_JSONLD,
    },
    '/premium': {
        title: `Premium Plans | ${BRAND_NAME_DISPLAY}`,
        description: `Unlock custom branding, portfolio analytics, and premium features with ${BRAND_NAME_DISPLAY} — the AI resume-to-portfolio builder.`,
        robots: 'index, follow',
    },
    '/sign-in': {
        title: `Sign In | ${BRAND_NAME_DISPLAY}`,
        description: `Sign in to your ${BRAND_NAME_DISPLAY} account to manage and publish your AI-powered professional portfolio.`,
        robots: 'index, follow',
    },
    '/sign-up': {
        title: `Sign Up Free | ${BRAND_NAME_DISPLAY}`,
        description: `Create your free ${BRAND_NAME_DISPLAY} account and turn your resume into a shareable portfolio in seconds.`,
        robots: 'index, follow',
    },
}

export const PRIVATE_ROUTE_PREFIXES = [
    '/dashboard',
    '/settings',
    '/onboarding',
    '/upload',
    '/editor',
    '/analytics',
    '/username',
]

const PRIVATE_ROUTE_TITLES = {
    '/dashboard': 'Dashboard',
    '/settings': 'Settings',
    '/onboarding': 'Onboarding',
    '/upload': 'Upload Resume',
    '/editor': 'Profile Editor',
    '/analytics': 'Analytics',
    '/username': 'Choose Username',
}

export function isPortfolioRoute(pathname) {
    return pathname !== '/'
        && !pathname.startsWith('/sign')
        && !pathname.startsWith('/username')
        && !pathname.startsWith('/onboarding')
        && !pathname.startsWith('/upload')
        && !pathname.startsWith('/editor')
        && !pathname.startsWith('/dashboard')
        && !pathname.startsWith('/settings')
        && !pathname.startsWith('/analytics')
        && !pathname.startsWith('/premium')
}

export function isPrivateRoute(pathname) {
    return PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function getPrivateRouteTitle(pathname) {
    const match = PRIVATE_ROUTE_PREFIXES.find((prefix) => pathname.startsWith(prefix))
    const label = match ? PRIVATE_ROUTE_TITLES[match] : 'Dashboard'
    return `${label} | ${BRAND_NAME_DISPLAY}`
}

export function resolvePageSeo(pathname) {
    if (pathname.startsWith('/sign-in')) return PAGE_SEO['/sign-in']
    if (pathname.startsWith('/sign-up')) return PAGE_SEO['/sign-up']
    return PAGE_SEO[pathname] || PAGE_SEO['/']
}