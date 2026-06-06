import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { getCurrentUser, getMyProfile } from '../utils/api'
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

function DashboardLayout() {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [dbUser, setDbUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [basicDetails, setBasicDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)

    const refreshData = useCallback(async () => {
        setIsLoading(true)
        setLoadError(null)

        try {
            const [userRes, profileRes] = await Promise.all([
                getCurrentUser(),
                getMyProfile(),
            ])
            setDbUser(userRes.data)
            setProfile(profileRes.data)
            setBasicDetails(profileRes.data?.basicDetails || null)
        } catch (error) {
            setLoadError(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const contextValue = useMemo(() => ({
        openSidebar: () => setSidebarOpen(true),
        dbUser,
        profile,
        basicDetails,
        isLoading,
        loadError,
        refreshData,
    }), [dbUser, profile, basicDetails, isLoading, loadError, refreshData])

    return (
        <DashboardLayoutContext.Provider value={contextValue}>
            <div className="min-h-screen pt-navbar overflow-x-clip">
                <div className="flex gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <DashboardSidebar
                        basicDetails={basicDetails}
                        dbUser={dbUser}
                        currentPath={location.pathname}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </div>
        </DashboardLayoutContext.Provider>
    )
}

export default DashboardLayout