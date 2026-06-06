import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DashboardNavBridgeContext = createContext(null)

export function DashboardNavBridgeProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const openSidebar = useCallback(() => setSidebarOpen(true), [])
    const closeSidebar = useCallback(() => setSidebarOpen(false), [])

    const value = useMemo(() => ({
        sidebarOpen,
        openSidebar,
        closeSidebar,
        setSidebarOpen,
    }), [sidebarOpen, openSidebar, closeSidebar])

    return (
        <DashboardNavBridgeContext.Provider value={value}>
            {children}
        </DashboardNavBridgeContext.Provider>
    )
}

export function useDashboardNavBridge() {
    return useContext(DashboardNavBridgeContext)
}