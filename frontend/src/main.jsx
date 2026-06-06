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
                    colorPrimary: '#5a7a9e',
                    colorBackground: '#09090b',
                    colorText: '#fafafa',
                    colorInputBackground: '#18181b',
                    colorInputText: '#fafafa',
                    borderRadius: '0.625rem',
                },
                elements: {
                    card: 'bg-dark-900/80 backdrop-blur-xl border border-white/[0.06]',
                    headerTitle: 'text-white',
                    headerSubtitle: 'text-dark-400',
                    formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
                    footerActionLink: 'text-primary-400 hover:text-primary-300',
                }
            }}
        >
            <App />
        </ClerkProvider>
    </React.StrictMode>,
)