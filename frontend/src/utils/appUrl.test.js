import { describe, it, expect, vi, afterEach } from 'vitest'
import { getAppUrl, getPortfolioUrl } from './appUrl'

describe('getAppUrl', () => {
    const originalEnv = import.meta.env.VITE_APP_URL

    afterEach(() => {
        import.meta.env.VITE_APP_URL = originalEnv
        vi.unstubAllGlobals()
    })

    it('returns env URL without trailing slash', () => {
        import.meta.env.VITE_APP_URL = 'https://example.com/'
        expect(getAppUrl()).toBe('https://example.com')
    })

    it('falls back to window.location.origin', () => {
        import.meta.env.VITE_APP_URL = ''
        vi.stubGlobal('window', { location: { origin: 'http://localhost:5173' } })
        expect(getAppUrl()).toBe('http://localhost:5173')
    })
})

describe('getPortfolioUrl', () => {
    it('builds portfolio URL from username', () => {
        import.meta.env.VITE_APP_URL = 'https://example.com'
        expect(getPortfolioUrl('johndoe')).toBe('https://example.com/johndoe')
    })
})