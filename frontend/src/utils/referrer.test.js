import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    getReferrerCategoryLabel,
    getReferrerIcon,
    getTrackingReferrer,
} from './referrer'
import {
    Bot,
    Globe,
    Link2,
    Megaphone,
    Search,
    Share2,
} from 'lucide-react'

function mockBrowser({ href = 'https://portlify.app/ashish', referrer = '', search = '' } = {}) {
    vi.stubGlobal('window', {
        location: {
            origin: new URL(href).origin,
            href,
            search,
        },
    })
    vi.stubGlobal('document', { referrer })
}

describe('getTrackingReferrer', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns empty string outside the browser', () => {
        vi.stubGlobal('window', undefined)
        expect(getTrackingReferrer()).toBe('')
    })

    it('prioritizes utm params over document.referrer', () => {
        mockBrowser({
            referrer: 'https://linkedin.com/feed',
            search: '?utm_source=twitter&utm_medium=post&utm_campaign=spring',
        })

        expect(getTrackingReferrer()).toBe('utm:twitter:post:spring')
    })

    it('preserves campaign when medium is missing', () => {
        mockBrowser({
            search: '?utm_source=partner&utm_campaign=spring-drive',
        })

        expect(getTrackingReferrer()).toBe('utm:partner::spring-drive')
    })

    it('returns external document.referrer when no utm params exist', () => {
        mockBrowser({
            referrer: 'https://chatgpt.com/share/abc',
        })

        expect(getTrackingReferrer()).toBe('https://chatgpt.com/share/abc')
    })

    it('treats same-origin navigation as direct traffic', () => {
        mockBrowser({
            href: 'https://portlify.app/ashish',
            referrer: 'https://portlify.app/dashboard',
        })

        expect(getTrackingReferrer()).toBe('')
    })
})

describe('referrer display helpers', () => {
    it('maps categories to icons', () => {
        expect(getReferrerIcon('ai')).toBe(Bot)
        expect(getReferrerIcon('social')).toBe(Share2)
        expect(getReferrerIcon('search')).toBe(Search)
        expect(getReferrerIcon('direct')).toBe(Link2)
        expect(getReferrerIcon('campaign')).toBe(Megaphone)
        expect(getReferrerIcon('unknown')).toBe(Globe)
    })

    it('maps categories to readable labels', () => {
        expect(getReferrerCategoryLabel('ai')).toBe('AI assistant')
        expect(getReferrerCategoryLabel('social')).toBe('Social network')
        expect(getReferrerCategoryLabel('direct')).toBe('Direct traffic')
        expect(getReferrerCategoryLabel('unknown')).toBe('Other source')
    })
})
