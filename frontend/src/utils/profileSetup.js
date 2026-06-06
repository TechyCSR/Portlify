const PARSED_RESUME_STORAGE_KEY = 'parsedResumeData'

export function hasPendingResumeData() {
    try {
        const stored = sessionStorage.getItem(PARSED_RESUME_STORAGE_KEY)
        if (!stored) return false
        const parsed = JSON.parse(stored)
        return Boolean(parsed?.resumeUrl?.trim())
    } catch {
        return false
    }
}

export function hasCompletedProfileSetup(profile) {
    if (!profile) return false
    const hasName = Boolean(profile.basicDetails?.name?.trim())
    const hasResume = Boolean(profile.resumeUrl?.trim())
    return hasName && hasResume
}

export function getAllowedPathsWithoutSetup(hasPendingResume = hasPendingResumeData()) {
    return hasPendingResume ? ['/upload', '/editor'] : ['/upload']
}

export function isDashboardPathAllowed(pathname, profile, hasPendingResume = hasPendingResumeData()) {
    if (hasCompletedProfileSetup(profile)) return true
    return getAllowedPathsWithoutSetup(hasPendingResume).includes(pathname)
}

export function isNavItemEnabled(itemPath, profile, hasPendingResume = hasPendingResumeData()) {
    if (hasCompletedProfileSetup(profile)) return true
    if (itemPath === '/upload') return true
    if (itemPath === '/editor' && hasPendingResume) return true
    return false
}

export function isMissingProfileError(error) {
    return error?.response?.data?.needsSetup === true
}

function normalizeLoadErrors(loadErrors) {
    if (!loadErrors) {
        return { user: null, profile: null }
    }

    if (loadErrors?.response || loadErrors?.message) {
        return { user: null, profile: loadErrors }
    }

    return {
        user: loadErrors.user ?? null,
        profile: loadErrors.profile ?? null,
    }
}

function hasNeedsRegistrationError(...errors) {
    return errors.some((error) => error?.response?.data?.needsRegistration)
}

export function resolveResumeRouteGuard(pathname, profile, loadErrors = null, hasPendingResume = hasPendingResumeData()) {
    const { user: userLoadError, profile: profileLoadError } = normalizeLoadErrors(loadErrors)

    if (hasNeedsRegistrationError(userLoadError, profileLoadError)) {
        return { type: 'redirect', to: '/username' }
    }

    if (userLoadError && !profile?.username) {
        if (!profile) {
            if (isDashboardPathAllowed(pathname, profile, hasPendingResume)) {
                return { type: 'allow' }
            }
            return { type: 'error' }
        }

        if (!isDashboardPathAllowed(pathname, profile, hasPendingResume)) {
            return { type: 'redirect', to: '/upload' }
        }

        return { type: 'allow' }
    }

    if (profileLoadError) {
        if (hasCompletedProfileSetup(profile)) {
            return { type: 'allow' }
        }

        if (!profile) {
            if (isDashboardPathAllowed(pathname, profile, hasPendingResume)) {
                return { type: 'allow' }
            }
            return { type: 'error' }
        }

        if (!isDashboardPathAllowed(pathname, profile, hasPendingResume)) {
            return { type: 'redirect', to: '/upload' }
        }

        return { type: 'allow' }
    }

    if (!isDashboardPathAllowed(pathname, profile, hasPendingResume)) {
        return { type: 'redirect', to: '/upload' }
    }

    return { type: 'allow' }
}
