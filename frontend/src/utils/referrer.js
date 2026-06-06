import {
    Bot,
    Globe,
    Link2,
    Mail,
    Megaphone,
    Search,
    Share2,
} from 'lucide-react'

const REFERRER_ICONS = {
    direct: Link2,
    ai: Bot,
    social: Share2,
    search: Search,
    email: Mail,
    campaign: Megaphone,
    website: Globe,
    other: Globe,
}

export function getReferrerIcon(category) {
    return REFERRER_ICONS[category] || REFERRER_ICONS.other
}

export function getReferrerCategoryLabel(category) {
    const labels = {
        direct: 'Direct traffic',
        ai: 'AI assistant',
        social: 'Social network',
        search: 'Search engine',
        email: 'Email client',
        campaign: 'Campaign link',
        website: 'Website',
        other: 'Other source',
    };

    return labels[category] || labels.other
}

function isSameOriginReferrer(referrer) {
    if (!referrer || typeof window === 'undefined') {
        return false;
    }

    try {
        return new URL(referrer).origin === window.location.origin;
    } catch {
        return false;
    }
}

export function getTrackingReferrer() {
    if (typeof window === 'undefined') {
        return '';
    }

    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source')?.trim();
    const utmMedium = params.get('utm_medium')?.trim();
    const utmCampaign = params.get('utm_campaign')?.trim();

    if (utmSource) {
        return ['utm', utmSource, utmMedium || '', utmCampaign || ''].join(':');
    }

    const referrer = document.referrer || '';
    if (isSameOriginReferrer(referrer)) {
        return '';
    }

    return referrer;
}
