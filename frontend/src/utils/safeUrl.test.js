import { describe, it, expect } from 'vitest'
import { safeHref, safeMailto } from './safeUrl'

describe('safeHref', () => {
    it('allows https URLs', () => {
        expect(safeHref('https://example.com')).toBe('https://example.com')
    })

    it('blocks javascript URLs', () => {
        expect(safeHref('javascript:alert(1)')).toBeNull()
    })
})

describe('safeMailto', () => {
    it('builds mailto for valid email', () => {
        expect(safeMailto('user@example.com')).toBe('mailto:user@example.com')
    })

    it('rejects invalid email', () => {
        expect(safeMailto('not-an-email')).toBeNull()
    })
})