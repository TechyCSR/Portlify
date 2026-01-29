import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('portlify-theme')
        if (saved) return saved
        // Then check system preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light'
        }
        return 'dark'
    })

    useEffect(() => {
        localStorage.setItem('portlify-theme', theme)
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export default ThemeContext
