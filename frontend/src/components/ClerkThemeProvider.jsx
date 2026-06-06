import { ClerkProvider } from '@clerk/clerk-react'
import { useTheme } from '../context/ThemeContext'
import { getClerkAppearance } from '../utils/clerkAppearance'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key')
}

function ClerkThemeProvider({ children }) {
    const { theme } = useTheme()

    return (
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={getClerkAppearance(theme)}
        >
            {children}
        </ClerkProvider>
    )
}

export default ClerkThemeProvider