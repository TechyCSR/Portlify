import { getPortfolioUrl } from './appUrl'

const TWITTER_CHAR_LIMIT = 280
const LINKEDIN_PREFILL_CHAR_LIMIT = 280
const LINKEDIN_SHARE_URL_LIMIT = 1800

export function buildTrackedPortfolioUrl(username, platform = 'share') {
    const url = new URL(getPortfolioUrl(username))
    url.searchParams.set('utm_source', platform)
    url.searchParams.set('utm_medium', 'social')
    url.searchParams.set('utm_campaign', 'portfolio_share')
    return url.toString()
}

function truncateText(text, maxLength) {
    const trimmed = (text || '').trim()
    if (!trimmed || trimmed.length <= maxLength) {
        return trimmed
    }

    return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`
}

function sanitizeHeadline(headline, maxLength = 48) {
    if (!headline) {
        return ''
    }

    const primary = headline.split('|')[0].trim()
    return truncateText(primary, maxLength)
}

function formatList(items, limit = 3) {
    const values = items.filter(Boolean).slice(0, limit)
    if (values.length === 0) return ''
    if (values.length === 1) return values[0]
    if (values.length === 2) return `${values[0]} and ${values[1]}`
    return `${values.slice(0, -1).join(', ')}, and ${values[values.length - 1]}`
}

function getTopSkills(profile, limit = 3) {
    const skills = profile?.skills
    if (!skills) {
        return []
    }

    return [
        ...(skills.programmingLanguages || []),
        ...(skills.frameworks || []),
        ...(skills.tools || []),
    ].filter(Boolean).slice(0, limit)
}

function getFeaturedProject(profile) {
    const project = profile?.projects?.find((entry) => entry?.title?.trim())
    return truncateText(project?.title?.trim() || '', 48)
}

function buildLinkedInHashtags(headline, skills) {
    const tags = new Set(['Portfolio', 'OpenToWork'])
    const headlineLower = (headline || '').toLowerCase()

    if (headlineLower.includes('developer') || headlineLower.includes('engineer')) {
        tags.add('SoftwareDevelopment')
    } else if (headlineLower.includes('design')) {
        tags.add('Design')
    } else if (headlineLower.includes('product')) {
        tags.add('ProductManagement')
    } else if (headlineLower.includes('data')) {
        tags.add('DataScience')
    } else if (skills[0]) {
        tags.add(skills[0].replace(/[^a-zA-Z0-9]/g, ''))
    }

    return [...tags].slice(0, 3).map((tag) => `#${tag}`).join(' ')
}

function getShareContext({ username, basicDetails, profile, platform }) {
    const name = basicDetails?.name?.trim() || ''
    const headline = basicDetails?.headline?.trim() || ''
    const role = sanitizeHeadline(headline)
    const skills = getTopSkills(profile)
    const skillsLabel = formatList(skills, 3)
    const featuredProject = getFeaturedProject(profile)
    const portfolioUrl = platform
        ? buildTrackedPortfolioUrl(username, platform)
        : getPortfolioUrl(username)

    return {
        name,
        firstName: name.split(' ')[0] || '',
        role,
        skills,
        skillsLabel,
        featuredProject,
        portfolioUrl,
    }
}

function joinBlocks(blocks) {
    return blocks
        .map((block) => (Array.isArray(block) ? block.filter(Boolean).join('\n') : block))
        .filter(Boolean)
        .join('\n\n')
}

function buildLinkedInVariants(ctx) {
    const hashtags = buildLinkedInHashtags(ctx.role, ctx.skills)

    const variants = []

    if (ctx.name && ctx.role && ctx.skillsLabel) {
        variants.push(joinBlocks([
            "I'm excited to share my portfolio!",
            `I'm ${ctx.name}, a ${ctx.role}.`,
            `Skills: ${ctx.skillsLabel}.`,
            'Explore my projects and experience:',
            ctx.portfolioUrl,
            hashtags,
        ]))
    }

    if (ctx.name && ctx.role) {
        variants.push(joinBlocks([
            "I'm excited to share my portfolio!",
            `I'm ${ctx.name}, a ${ctx.role}.`,
            'Projects, skills, and experience in one place.',
            ctx.portfolioUrl,
            hashtags,
        ]))
    }

    if (ctx.name) {
        variants.push(joinBlocks([
            "I'm excited to share my portfolio!",
            `I'm ${ctx.name}.`,
            ctx.portfolioUrl,
            hashtags,
        ]))
    }

    variants.push(joinBlocks([
        "I'm excited to share my portfolio!",
        'Projects, skills, and experience in one place.',
        ctx.portfolioUrl,
        hashtags,
    ]))

    return variants
}

export function buildLinkedInPost({ username, basicDetails, profile }) {
    const ctx = getShareContext({ username, basicDetails, profile, platform: 'linkedin' })
    const variants = buildLinkedInVariants(ctx)

    const fitted = variants.find((post) => post.length <= LINKEDIN_PREFILL_CHAR_LIMIT)
    if (fitted) {
        return fitted
    }

    const minimal = joinBlocks([
        "I'm excited to share my portfolio!",
        ctx.name ? `I'm ${ctx.name}.` : '',
        ctx.portfolioUrl,
        buildLinkedInHashtags(ctx.role, ctx.skills),
    ])

    return truncateText(minimal, LINKEDIN_PREFILL_CHAR_LIMIT)
}

export function truncateForTwitter(text, maxLength = TWITTER_CHAR_LIMIT) {
    if (text.length <= maxLength) {
        return text
    }

    const suffix = '…'
    return `${text.slice(0, maxLength - suffix.length).trimEnd()}${suffix}`
}

function buildTwitterVariants(ctx) {
    const variants = []

    if (ctx.name && ctx.role) {
        variants.push(joinBlocks([
            'Just launched my portfolio 🚀',
            [
                ctx.name,
                ctx.role,
            ],
            ctx.skillsLabel ? `Skills: ${ctx.skillsLabel}` : '',
            ctx.featuredProject ? `Featured: ${ctx.featuredProject}` : '',
            'Would love your feedback.',
        ]))
    }

    if (ctx.name) {
        variants.push(joinBlocks([
            'My portfolio is live 🚀',
            ctx.name,
            ctx.skillsLabel ? `Skills: ${ctx.skillsLabel}` : '',
            'Take a look — feedback welcome.',
        ]))
    }

    variants.push(joinBlocks([
        'My portfolio is live 🚀',
        'Projects, skills, and experience — all in one place.',
        'Feedback welcome.',
    ]))

    return variants
}

export function buildTwitterPost({ username, basicDetails, profile }) {
    const ctx = getShareContext({ username, basicDetails, profile, platform: 'twitter' })
    const variants = buildTwitterVariants(ctx)

    const fitted = variants.find((post) => post.length <= TWITTER_CHAR_LIMIT)
    if (fitted) {
        return fitted
    }

    if (ctx.name) {
        return truncateForTwitter(joinBlocks([
            'My portfolio is live 🚀',
            ctx.name,
            'Feedback welcome.',
        ]))
    }

    return 'My portfolio is live 🚀\n\nFeedback welcome.'
}

export function buildLinkedInShareUrl(postText) {
    const params = new URLSearchParams({
        shareActive: 'true',
        text: postText,
    })

    return `https://www.linkedin.com/feed/?${params.toString()}`
}

export function buildTwitterShareUrl(postText, shareUrl) {
    const params = new URLSearchParams({ text: postText })
    if (shareUrl) {
        params.set('url', shareUrl)
    }
    return `https://twitter.com/intent/tweet?${params.toString()}`
}

function fitLinkedInSharePayload(text) {
    let nextText = text
    let shareUrl = buildLinkedInShareUrl(nextText)

    while (shareUrl.length > LINKEDIN_SHARE_URL_LIMIT && nextText.length > 80) {
        nextText = truncateText(nextText, nextText.length - 40)
        shareUrl = buildLinkedInShareUrl(nextText)
    }

    return { text: nextText, url: shareUrl }
}

export function getShareContent(platform, shareData) {
    if (!shareData?.username) {
        return null
    }

    const portfolioUrl = buildTrackedPortfolioUrl(shareData.username, platform)

    if (platform === 'linkedin') {
        const text = buildLinkedInPost(shareData)
        const payload = fitLinkedInSharePayload(text)

        return {
            platform,
            text: payload.text,
            url: payload.url,
        }
    }

    if (platform === 'twitter') {
        const text = buildTwitterPost(shareData)
        return {
            platform,
            text,
            url: buildTwitterShareUrl(text, portfolioUrl),
        }
    }

    return null
}

export function openShareWindow(url) {
    if (typeof window === 'undefined' || !url) {
        return false
    }

    const popup = window.open(url, '_blank', 'noopener,noreferrer,width=640,height=720')
    return popup != null
}

export function getEmailSignatureSnippet(username, basicDetails) {
    const name = basicDetails?.name?.trim() || 'Your Name'
    const portfolioUrl = buildTrackedPortfolioUrl(username, 'email')

    return joinBlocks([
        name,
        sanitizeHeadline(basicDetails?.headline?.trim()) || 'Your headline',
        `Portfolio: ${portfolioUrl}`,
    ])
}

export function getResumeLinkLine(username) {
    return `View my portfolio: ${buildTrackedPortfolioUrl(username, 'resume')}`
}

export const SHARE_LIMITS = {
    linkedinPrefill: LINKEDIN_PREFILL_CHAR_LIMIT,
    linkedinShareUrl: LINKEDIN_SHARE_URL_LIMIT,
    twitter: TWITTER_CHAR_LIMIT,
}
