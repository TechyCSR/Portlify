import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { getCurrentUser, getMyProfile } from '../utils/api'
import {
    hasCompletedProfileSetup,
    hasPendingResumeData,
    isMissingProfileError,
    resolveResumeRouteGuard,
} from '../utils/profileSetup'
import { ErrorState, LoadingState } from './AsyncState'
import { ICON_STROKE } from './IconTile'
import DashboardSidebar from './DashboardSidebar'

const DashboardLayoutContext = createContext(null)

export function useDashboardLayout() {
    const context = useContext(DashboardLayoutContext)
    if (!context) {
        throw new Error('useDashboardLayout must be used within DashboardLayout')
    }
    return context
}

export function SidebarMenuButton({ className = '' }) {
    const { openSidebar } = useDashboardLayout()

    return (
        <button
            type="button"
            onClick={openSidebar}
            className={`md:hidden p-2.5 rounded-xl bg-tertiary text-secondary hover:text-primary hover:bg-surface-hover transition-colors flex-shrink-0 ${className}`}
            aria-label="Open navigation menu"
        >
            <Menu size={20} strokeWidth={ICON_STROKE} />
        </button>
    )
}

function resolveDbUser(userData, profileData) {
    if (userData) {
        return userData
    }

    if (profileData?.username) {
        return { username: profileData.username }
    }

    return null
}

function DashboardLayout() {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [dbUser, setDbUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [basicDetails, setBasicDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [userLoadError, setUserLoadError] = useState(null)
    const [profileLoadError, setProfileLoadError] = useState(null)
    const [hasPendingResume, setHasPendingResume] = useState(() => hasPendingResumeData())
    const lastKnownProfileRef = useRef({ profile: null, basicDetails: null })

    const refreshPendingResume = useCallback(() => {
        setHasPendingResume(hasPendingResumeData())
    }, [])

    const refreshData = useCallback(async () => {
        setIsLoading(true)
        setUserLoadError(null)
        setProfileLoadError(null)

        const [userResult, profileResult] = await Promise.allSettled([
            getCurrentUser(),
            getMyProfile(),
        ])

        let nextUserData = null
        let nextProfileData = null
        let nextUserLoadError = null
        let nextProfileLoadError = null

        if (userResult.status === 'fulfilled') {
            nextUserData = userResult.value.data
        } else {
            nextUserLoadError = userResult.reason
        }

        if (profileResult.status === 'fulfilled') {
            nextProfileData = profileResult.value.data
            lastKnownProfileRef.current = {
                profile: nextProfileData,
                basicDetails: nextProfileData?.basicDetails || null,
            }
        } else if (isMissingProfileError(profileResult.reason)) {
            lastKnownProfileRef.current = { profile: null, basicDetails: null }
            nextProfileData = null
        } else {
            nextProfileLoadError = profileResult.reason
            if (lastKnownProfileRef.current.profile) {
                nextProfileData = lastKnownProfileRef.current.profile
            }
        }

        setDbUser(resolveDbUser(nextUserData, nextProfileData))
        setProfile(nextProfileData)
        setBasicDetails(nextProfileData?.basicDetails || null)
        setUserLoadError(nextUserLoadError)
        setProfileLoadError(nextProfileLoadError)
        setHasPendingResume(hasPendingResumeData())
        setIsLoading(false)
    }, [])

    useEffect(() => {
        setSidebarOpen(false)
        setHasPendingResume(hasPendingResumeData())
    }, [location.pathname])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const needsResumeSetup = useMemo(
        () => !isLoading && !hasCompletedProfileSetup(profile),
        [isLoading, profile],
    )

    const loadErrors = useMemo(
        () => ({ user: userLoadError, profile: profileLoadError }),
        [userLoadError, profileLoadError],
    )

    const routeGuardDecision = useMemo(() => {
        if (isLoading) {
            return { type: 'loading' }
        }

        return resolveResumeRouteGuard(
            location.pathname,
            profile,
            loadErrors,
            hasPendingResume,
        )
    }, [isLoading, loadErrors, profile, location.pathname, hasPendingResume])

    const isRouteReady = routeGuardDecision.type === 'allow'

    const blockingLoadError = useMemo(() => {
        if (routeGuardDecision.type !== 'error') {
            return null
        }

        return userLoadError || profileLoadError
    }, [routeGuardDecision.type, userLoadError, profileLoadError])

    const contextValue = useMemo(() => ({
        openSidebar: () => setSidebarOpen(true),
        dbUser,
        profile,
        basicDetails,
        isLoading,
        loadError: blockingLoadError,
        refreshData,
        refreshPendingResume,
        needsResumeSetup,
        hasPendingResume,
        isRouteReady,
    }), [dbUser, profile, basicDetails, isLoading, blockingLoadError, refreshData, refreshPendingResume, needsResumeSetup, hasPendingResume, isRouteReady])

    const mainContent = (() => {
        if (routeGuardDecision.type === 'error') {
            return (
                <ErrorState
                    message={blockingLoadError?.response?.data?.error || 'Failed to load your profile. Please try again.'}
                    onRetry={refreshData}
                />
            )
        }

        if (routeGuardDecision.type === 'redirect') {
            return <Navigate to={routeGuardDecision.to} replace />
        }

        if (routeGuardDecision.type === 'loading') {
            return <LoadingState className="min-h-[40vh]" />
        }

        return <Outlet />
    })()

    return (
        <DashboardLayoutContext.Provider value={contextValue}>
            <div className="min-h-screen pt-navbar overflow-x-clip">
                <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <DashboardSidebar
                        basicDetails={basicDetails}
                        dbUser={dbUser}
                        profile={profile}
                        currentPath={location.pathname}
                        needsResumeSetup={needsResumeSetup}
                        hasPendingResume={hasPendingResume}
                        isLoading={isLoading}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <main className="flex-1 min-w-0">
                        {mainContent}
                    </main>
                </div>
            </div>
        </DashboardLayoutContext.Provider>
    )
}

export default DashboardLayout