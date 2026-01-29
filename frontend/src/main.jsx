import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ClerkProvider
            publishableKey={CLERK_PUBLISHABLE_KEY}
            appearance={{
                variables: {
                    colorPrimary: '#0ea5e9',
                    colorBackground: '#0f172a',
                    colorText: '#f1f5f9',
                    colorInputBackground: '#1e293b',
                    colorInputText: '#f1f5f9',
                    borderRadius: '0.75rem',
                },
                elements: {
                    card: 'bg-dark-900/80 backdrop-blur-xl border border-white/10',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-dark-300',
                    formButtonPrimary: 'bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400',
                    footerActionLink: 'text-primary-400 hover:text-primary-300',
                }
            }}
        >
            <App />
        </ClerkProvider>
    </React.StrictMode>,
)
