import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    buildLinkedInPost,
    buildLinkedInShareUrl,
    buildTrackedPortfolioUrl,
    buildTwitterPost,
    buildTwitterShareUrl,
    getEmailSignatureSnippet,
    getResumeLinkLine,
    getShareContent,
    SHARE_LIMITS,
    truncateForTwitter,
} from './sharePosts'

const richProfile = {
    username: 'ashish',
    basicDetails: {
        name: 'Prajapati Ashish',
        headline: 'Full Stack Developer',
        location: 'Bengaluru, India',
        about: 'I build reliable products end to end. Passionate about clean code and thoughtful UX.',
    },
    profile: {
        skills: {
            programmingLanguages: ['TypeScript', 'JavaScript', 'Python'],
            frameworks: ['React', 'Node.js'],
            tools: ['Docker'],
        },
        projects: [
            { title: 'Orbit (Vexelity AI) - Cursor-Style AI Editor (Open Source)' },
            { title: 'Analytics Platform' },
        ],
        experience: [
            { title: 'Senior Engineer', company: 'Acme Corp' },
        ],
    },
}

describe('buildTrackedPortfolioUrl', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns a portfolio url with platform-specific utm params', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        expect(buildTrackedPortfolioUrl('ashish')).toBe(
            'https://portlify.app/ashish?utm_source=share&utm_medium=social&utm_campaign=portfolio_share'
        )
        expect(buildTrackedPortfolioUrl('ashish', 'linkedin')).toContain('utm_source=linkedin')
    })
})

describe('buildLinkedInPost', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('creates a compact linkedin post that fits prefill limits', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const post = buildLinkedInPost(richProfile)

        expect(post.length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinPrefill)
        expect(post).toContain("I'm excited to share my portfolio!")
        expect(post).toContain('Prajapati Ashish')
        expect(post).toContain('Full Stack Developer')
        expect(post).toContain('https://portlify.app/ashish?utm_source=linkedin')
        expect(post).toContain('#Portfolio')
        expect(post).not.toContain("Here's what you'll find")
    })

    it('sanitizes pipe-separated headlines so linkedin does not truncate mid-line', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const post = buildLinkedInPost({
            username: 'ashish',
            basicDetails: {
                name: 'Prajapati Ashish',
                headline: 'Full-Stack Developer | React | Node.js | TypeScript | Python',
            },
            profile: richProfile.profile,
        })

        expect(post.length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinPrefill)
        expect(post).toContain('Full-Stack Developer')
        expect(post).not.toContain('| React')
        expect(post).toContain('https://portlify.app/ashish?utm_source=linkedin')
        expect(buildLinkedInShareUrl(post).length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinShareUrl)
    })

    it('falls back gracefully when profile details are sparse', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const post = buildLinkedInPost({
            username: 'ashish',
            basicDetails: {},
            profile: {},
        })

        expect(post).toContain('https://portlify.app/ashish?utm_source=linkedin')
        expect(post.length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinPrefill)
    })
})

describe('buildTwitterPost', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('creates a clean formatted tweet without embedding the url in text', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const post = buildTwitterPost(richProfile)

        expect(post.length).toBeLessThanOrEqual(280)
        expect(post).toContain('Just launched my portfolio 🚀')
        expect(post).toContain('Prajapati Ashish')
        expect(post).toContain('Full Stack Developer')
        expect(post).toContain('Skills: TypeScript, JavaScript, and Python')
        expect(post).not.toContain('http')
        expect(post).not.toContain('utm_')
        expect(post).toMatch(/Prajapati Ashish\nFull Stack Developer/)
    })

    it('truncates long headlines safely for twitter', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const post = buildTwitterPost({
            username: 'ashish',
            basicDetails: {
                name: 'Prajapati Ashish',
                headline: 'A'.repeat(200),
            },
            profile: richProfile.profile,
        })

        expect(post.length).toBeLessThanOrEqual(280)
        expect(post).not.toContain('http')
    })
})

describe('share url builders', () => {
    it('builds encoded linkedin and twitter share urls', () => {
        const text = 'Hello world'
        const shareUrl = 'https://portlify.app/ashish'

        expect(buildLinkedInShareUrl(text)).toBe(
            'https://www.linkedin.com/feed/?shareActive=true&text=Hello+world'
        )
        expect(buildTwitterShareUrl(text, shareUrl)).toBe(
            'https://twitter.com/intent/tweet?text=Hello+world&url=https%3A%2F%2Fportlify.app%2Fashish'
        )
    })
})

describe('getShareContent', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns null when username is missing', () => {
        expect(getShareContent('linkedin', { username: '' })).toBeNull()
    })

    it('returns a complete linkedin share payload within url limits', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const content = getShareContent('linkedin', {
            username: 'ashish',
            basicDetails: {
                name: 'Prajapati Ashish',
                headline: 'Full-Stack Developer | React | Node.js | TypeScript',
            },
            profile: richProfile.profile,
        })

        expect(content.platform).toBe('linkedin')
        expect(content.text.length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinPrefill)
        expect(content.text).toContain('Prajapati Ashish')
        expect(content.text).toContain('https://portlify.app/ashish?utm_source=linkedin')
        expect(content.url.length).toBeLessThanOrEqual(SHARE_LIMITS.linkedinShareUrl)
        expect(content.url).toContain('linkedin.com/feed/')
    })

    it('returns twitter share payload with url passed separately', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'
        const content = getShareContent('twitter', richProfile)

        expect(content.platform).toBe('twitter')
        expect(content.text).toContain('Prajapati Ashish')
        expect(content.text).not.toContain('http')
        expect(content.url).toContain('twitter.com/intent/tweet')
        expect(content.url).toContain(encodeURIComponent('utm_source=twitter'))
    })
})

describe('supporting snippets', () => {
    it('builds clean resume and signature snippets', () => {
        import.meta.env.VITE_APP_URL = 'https://portlify.app'

        expect(getEmailSignatureSnippet('ashish', {
            name: 'Ashish Kumar',
            headline: 'Engineer | React',
        })).toContain('Portfolio: https://portlify.app/ashish?utm_source=email')

        expect(getResumeLinkLine('ashish')).toContain('utm_source=resume')
    })

    it('truncates twitter text with an ellipsis', () => {
        expect(truncateForTwitter('a'.repeat(300))).toHaveLength(280)
        expect(truncateForTwitter('a'.repeat(300)).endsWith('…')).toBe(true)
    })
})