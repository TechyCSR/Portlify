import {
    BRAND_ALTERNATE_NAMES,
    BRAND_AUTHOR,
    BRAND_AUTHOR_URL,
    BRAND_DESCRIPTION,
    BRAND_LOGO_SRC,
    BRAND_NAME,
    BRAND_NAME_DISPLAY,
    BRAND_SOCIAL,
    BRAND_TAGLINE,
    BRAND_TWITTER,
    DEFAULT_OG_IMAGE,
    DEFAULT_SITE_URL,
    DEFAULT_TITLE,
    OG_IMAGE_PATH,
    OG_IMAGE_VERSION,
} from '../constants/brand'
import { getFaqSchemaEntities } from '../constants/faq'
import { getAppUrl, getPortfolioUrl } from './appUrl'
import { safeHref } from './safeUrl'

const DEFAULT_META = {
    title: DEFAULT_TITLE,
    description: BRAND_DESCRIPTION,
    canonical: `${DEFAULT_SITE_URL}/`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    ogImageAlt: `${BRAND_NAME_DISPLAY} - Transform your resume into a portfolio`,
    robots: 'index, follow',
}

const JSON_LD_ID = 'portlify-dynamic-jsonld'

function getSiteUrl() {
    const url = getAppUrl()
    return url || DEFAULT_SITE_URL
}

function getAbsoluteAsset(path) {
    const base = getSiteUrl().replace(/\/$/, '')
    return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`
}

function getDefaultOgImage() {
    const base = getSiteUrl().replace(/\/$/, '')
    return `${base}${OG_IMAGE_PATH}?v=${OG_IMAGE_VERSION}`
}

function upsertMeta(selector, attributes) {
    let element = document.querySelector(selector)
    if (!element) {
        const isProperty = selector.includes('[property=')
        element = document.createElement('meta')
        if (isProperty) {
            const property = selector.match(/property="([^"]+)"/)?.[1]
            if (property) element.setAttribute('property', property)
        } else {
            const name = selector.match(/name="([^"]+)"/)?.[1]
            if (name) element.setAttribute('name', name)
        }
        document.head.appendChild(element)
    }

    Object.entries(attributes).forEach(([key, value]) => {
        if (value != null && value !== '') {
            element.setAttribute(key, value)
        }
    })

    return element
}

function upsertLink(rel, href) {
    let element = document.querySelector(`link[rel="${rel}"]`)
    if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', rel)
        document.head.appendChild(element)
    }
    element.setAttribute('href', href)
    return element
}

function setJsonLd(data) {
    let script = document.getElementById(JSON_LD_ID)
    if (!script) {
        script = document.createElement('script')
        script.id = JSON_LD_ID
        script.type = 'application/ld+json'
        document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)
}

function removeJsonLd() {
    document.getElementById(JSON_LD_ID)?.remove()
}

export function applySiteSeo(overrides = {}) {
    const siteUrl = getSiteUrl().replace(/\/$/, '')
    const meta = {
        ...DEFAULT_META,
        canonical: `${siteUrl}/`,
        ogImage: getDefaultOgImage(),
        ...overrides,
    }

    document.title = meta.title

    upsertMeta('meta[name="description"]', { content: meta.description })
    if (meta.keywords) {
        upsertMeta('meta[name="keywords"]', { content: meta.keywords })
    }
    upsertMeta('meta[name="robots"]', { content: meta.robots })
    upsertMeta('meta[property="og:type"]', { content: meta.ogType })
    upsertMeta('meta[property="og:url"]', { content: meta.canonical })
    upsertMeta('meta[property="og:title"]', { content: meta.title })
    upsertMeta('meta[property="og:description"]', { content: meta.description })
    upsertMeta('meta[property="og:image"]', { content: meta.ogImage })
    upsertMeta('meta[property="og:image:alt"]', { content: meta.ogImageAlt })
    upsertMeta('meta[property="og:site_name"]', { content: BRAND_NAME_DISPLAY })
    upsertMeta('meta[name="twitter:card"]', { content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { content: meta.title })
    upsertMeta('meta[name="twitter:description"]', { content: meta.description })
    upsertMeta('meta[name="twitter:image"]', { content: meta.ogImage })
    upsertMeta('meta[name="twitter:creator"]', { content: BRAND_TWITTER })
    upsertMeta('meta[name="twitter:site"]', { content: BRAND_TWITTER })

    upsertLink('canonical', meta.canonical)

    if (meta.jsonLd) {
        setJsonLd(meta.jsonLd)
    } else {
        removeJsonLd()
    }
}

export function resetSiteSeo() {
    applySiteSeo()
    removeJsonLd()
}

export function buildPortfolioSeo(profile, username) {
    const name = profile?.basicDetails?.name || username
    const headline = profile?.basicDetails?.headline
        || profile?.basicDetails?.about?.substring(0, 120)
        || 'Professional Portfolio'
    const aboutSnippet = profile?.basicDetails?.about?.substring(0, 155)
    const canonical = getPortfolioUrl(username)
    const profilePhoto = profile?.basicDetails?.profilePhoto
    const ogImage = profilePhoto || getDefaultOgImage()

    const description = aboutSnippet
        ? `${name} — ${aboutSnippet}${aboutSnippet.length >= 155 ? '…' : ''} View ${name}'s portfolio on ${BRAND_NAME_DISPLAY}.`
        : `${name}'s professional portfolio — ${headline}. Powered by ${BRAND_NAME_DISPLAY}, the AI resume-to-portfolio builder.`

    const title = `${name} — ${headline} | ${BRAND_NAME_DISPLAY}`

    const socialLinks = profile?.socialLinks || {}
    const sameAs = [
        safeHref(socialLinks.github),
        safeHref(socialLinks.linkedin),
        safeHref(socialLinks.twitter),
        safeHref(socialLinks.website),
    ].filter(Boolean)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfilePage',
                '@id': `${canonical}#profilepage`,
                url: canonical,
                name: `${name} | ${BRAND_NAME_DISPLAY}`,
                description,
                isPartOf: {
                    '@type': 'WebSite',
                    name: BRAND_NAME_DISPLAY,
                    url: getSiteUrl().replace(/\/$/, ''),
                },
                mainEntity: {
                    '@id': `${canonical}#person`,
                },
            },
            {
                '@type': 'Person',
                '@id': `${canonical}#person`,
                name,
                jobTitle: profile?.basicDetails?.headline || undefined,
                description: profile?.basicDetails?.about || undefined,
                url: canonical,
                image: profilePhoto || undefined,
                email: socialLinks.email || profile?.basicDetails?.email || undefined,
                sameAs: sameAs.length > 0 ? sameAs : undefined,
            },
            {
                '@type': 'WebPage',
                '@id': `${canonical}#webpage`,
                url: canonical,
                name: title,
                description,
                isPartOf: {
                    '@type': 'WebSite',
                    name: BRAND_NAME_DISPLAY,
                    url: getSiteUrl().replace(/\/$/, ''),
                },
                about: {
                    '@id': `${canonical}#person`,
                },
            },
        ],
    }

    return {
        title,
        description,
        canonical,
        ogType: 'profile',
        ogImage,
        ogImageAlt: `${name} — ${headline} on ${BRAND_NAME_DISPLAY}`,
        robots: 'index, follow',
        jsonLd,
    }
}

export function getSiteStructuredData(siteUrl = DEFAULT_SITE_URL) {
    const base = siteUrl.replace(/\/$/, '')
    const logoUrl = `${base}${BRAND_LOGO_SRC}`

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': `${base}/#organization`,
                name: BRAND_NAME,
                alternateName: BRAND_ALTERNATE_NAMES,
                url: base,
                logo: {
                    '@type': 'ImageObject',
                    url: logoUrl,
                    width: 512,
                    height: 512,
                },
                founder: {
                    '@type': 'Person',
                    name: BRAND_AUTHOR,
                    url: BRAND_AUTHOR_URL,
                },
                sameAs: BRAND_SOCIAL,
            },
            {
                '@type': 'WebSite',
                '@id': `${base}/#website`,
                name: BRAND_NAME_DISPLAY,
                alternateName: BRAND_ALTERNATE_NAMES,
                url: base,
                description: BRAND_DESCRIPTION,
                publisher: {
                    '@id': `${base}/#organization`,
                },
                inLanguage: 'en-US',
            },
            {
                '@type': 'WebApplication',
                '@id': `${base}/#app`,
                name: BRAND_NAME_DISPLAY,
                alternateName: BRAND_ALTERNATE_NAMES,
                url: base,
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                description: BRAND_DESCRIPTION,
                offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'INR',
                },
                featureList: [
                    'AI Resume Parsing',
                    'Instant Portfolio Generation',
                    'Custom Username URLs',
                    'Dark and Light Theme',
                    'Portfolio Analytics',
                    'PDF DOC DOCX Support',
                    'Custom Branding',
                    'Portfolio Export',
                ],
                screenshot: `${base}${OG_IMAGE_PATH}?v=${OG_IMAGE_VERSION}`,
                author: {
                    '@type': 'Person',
                    name: BRAND_AUTHOR,
                    url: BRAND_AUTHOR_URL,
                },
                publisher: {
                    '@id': `${base}/#organization`,
                },
            },
            {
                '@type': 'FAQPage',
                '@id': `${base}/#faq`,
                mainEntity: getFaqSchemaEntities(),
            },
        ],
    }
}

export function getDefaultSiteTitle() {
    return DEFAULT_TITLE
}

export function getDefaultSiteDescription() {
    return BRAND_DESCRIPTION
}

export function getDefaultSiteTagline() {
    return BRAND_TAGLINE
}