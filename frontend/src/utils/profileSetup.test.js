import { describe, expect, it, beforeEach } from 'vitest'
import {
    getAllowedPathsWithoutSetup,
    hasCompletedProfileSetup,
    hasPendingResumeData,
    isDashboardPathAllowed,
    isMissingProfileError,
    isNavItemEnabled,
    resolveResumeRouteGuard,
} from './profileSetup'

describe('profileSetup', () => {
    beforeEach(() => {
        sessionStorage.clear()
    })

    it('detects pending resume data in session storage', () => {
        expect(hasPendingResumeData()).toBe(false)

        sessionStorage.setItem('parsedResumeData', JSON.stringify({ resumeUrl: 'https://res.cloudinary.com/test/resume.pdf' }))
        expect(hasPendingResumeData()).toBe(true)
    })

    it('requires both name and resume URL for completed setup', () => {
        expect(hasCompletedProfileSetup(null)).toBe(false)
        expect(hasCompletedProfileSetup({ basicDetails: { name: 'Ada' } })).toBe(false)
        expect(hasCompletedProfileSetup({ resumeUrl: 'https://res.cloudinary.com/test/resume.pdf' })).toBe(false)
        expect(hasCompletedProfileSetup({
            basicDetails: { name: 'Ada Lovelace' },
            resumeUrl: 'https://res.cloudinary.com/test/resume.pdf',
        })).toBe(true)
    })

    it('limits routes until setup is complete', () => {
        const incompleteProfile = { basicDetails: { name: '' }, resumeUrl: '' }

        expect(getAllowedPathsWithoutSetup(false)).toEqual(['/upload'])
        expect(getAllowedPathsWithoutSetup(true)).toEqual(['/upload', '/editor'])
        expect(isDashboardPathAllowed('/dashboard', incompleteProfile)).toBe(false)
        expect(isDashboardPathAllowed('/upload', incompleteProfile)).toBe(true)
        expect(isDashboardPathAllowed('/editor', incompleteProfile, true)).toBe(true)
    })

    it('enables nav items based on setup progress', () => {
        const incompleteProfile = { basicDetails: { name: '' }, resumeUrl: '' }
        const completeProfile = {
            basicDetails: { name: 'Ada Lovelace' },
            resumeUrl: 'https://res.cloudinary.com/test/resume.pdf',
        }

        expect(isNavItemEnabled('/dashboard', incompleteProfile)).toBe(false)
        expect(isNavItemEnabled('/upload', incompleteProfile)).toBe(true)
        expect(isNavItemEnabled('/editor', incompleteProfile, true)).toBe(true)
        expect(isNavItemEnabled('/analytics', completeProfile)).toBe(true)
    })

    it('identifies missing profile API errors', () => {
        expect(isMissingProfileError({ response: { status: 404, data: { needsSetup: true } } })).toBe(true)
        expect(isMissingProfileError({ response: { status: 404, data: { needsRegistration: true } } })).toBe(false)
        expect(isMissingProfileError({ response: { status: 404, data: { error: 'Profile not found' } } })).toBe(false)
        expect(isMissingProfileError({ response: { status: 500, data: { error: 'Server error' } } })).toBe(false)
        expect(isMissingProfileError(null)).toBe(false)
    })

    it('redirects incomplete users away from locked dashboard routes', () => {
        const incompleteProfile = { basicDetails: { name: '' }, resumeUrl: '' }

        expect(resolveResumeRouteGuard('/premium', incompleteProfile, null)).toEqual({
            type: 'redirect',
            to: '/upload',
        })
        expect(resolveResumeRouteGuard('/upload', incompleteProfile, null)).toEqual({
            type: 'allow',
        })
        expect(resolveResumeRouteGuard('/editor', incompleteProfile, null, true)).toEqual({
            type: 'allow',
        })
    })

    it('allows completed users during transient profile load errors', () => {
        const completeProfile = {
            basicDetails: { name: 'Ada Lovelace' },
            resumeUrl: 'https://res.cloudinary.com/test/resume.pdf',
        }
        const loadError = { response: { status: 500, data: { error: 'Server error' } } }

        expect(resolveResumeRouteGuard('/dashboard', completeProfile, loadError)).toEqual({
            type: 'allow',
        })
    })

    it('still gates incomplete profiles when profile data is available alongside other errors', () => {
        const incompleteProfile = { basicDetails: { name: '' }, resumeUrl: '' }
        const loadError = { response: { status: 500, data: { error: 'Server error' } } }

        expect(resolveResumeRouteGuard('/settings', incompleteProfile, loadError)).toEqual({
            type: 'redirect',
            to: '/upload',
        })
    })

    it('redirects unregistered users to username selection', () => {
        expect(resolveResumeRouteGuard('/dashboard', null, {
            response: { data: { needsRegistration: true } },
        })).toEqual({
            type: 'redirect',
            to: '/username',
        })
    })

    it('shows an error on locked routes when profile is null and a load error occurred', () => {
        const loadError = { response: { status: 500, data: { error: 'Server error' } } }

        expect(resolveResumeRouteGuard('/dashboard', null, loadError)).toEqual({
            type: 'error',
        })
        expect(resolveResumeRouteGuard('/upload', null, loadError)).toEqual({
            type: 'allow',
        })
        expect(resolveResumeRouteGuard('/editor', null, loadError, true)).toEqual({
            type: 'allow',
        })
    })

    it('blocks locked routes when user fetch fails without a profile username fallback', () => {
        const userLoadError = { response: { status: 500, data: { error: 'Server error' } } }

        expect(resolveResumeRouteGuard('/dashboard', null, { user: userLoadError })).toEqual({
            type: 'error',
        })
        expect(resolveResumeRouteGuard('/upload', null, { user: userLoadError })).toEqual({
            type: 'allow',
        })
    })

    it('allows completed users when only the user fetch fails but profile has a username', () => {
        const completeProfile = {
            username: 'ada',
            basicDetails: { name: 'Ada Lovelace' },
            resumeUrl: 'https://res.cloudinary.com/test/resume.pdf',
        }
        const userLoadError = { response: { status: 500, data: { error: 'Server error' } } }

        expect(resolveResumeRouteGuard('/analytics', completeProfile, { user: userLoadError })).toEqual({
            type: 'allow',
        })
    })

    it('redirects unregistered users from either user or profile fetch errors', () => {
        expect(resolveResumeRouteGuard('/dashboard', null, {
            user: { response: { data: { needsRegistration: true } } },
        })).toEqual({
            type: 'redirect',
            to: '/username',
        })
        expect(resolveResumeRouteGuard('/dashboard', null, {
            profile: { response: { data: { needsRegistration: true } } },
        })).toEqual({
            type: 'redirect',
            to: '/username',
        })
    })
})
