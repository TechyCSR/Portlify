import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

// Icons for different toast types
const toastIcons = {
    success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    loading: (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    ),
    saved: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
    ),
    upload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
    processing: (
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    )
}

// Toast colors for different types
const toastColors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    loading: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
    saved: 'from-green-500/20 to-teal-500/20 border-green-500/30',
    upload: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    processing: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
}

const toastTextColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    loading: 'text-indigo-400',
    saved: 'text-green-400',
    upload: 'text-purple-400',
    processing: 'text-amber-400'
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const updateToast = useCallback((id, message, type) => {
        setToasts(prev => prev.map(t =>
            t.id === id ? { ...t, message, type } : t
        ))
    }, [])

    // Convenience methods
    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration ?? 3000),
        error: (msg, duration) => addToast(msg, 'error', duration ?? 5000),
        info: (msg, duration) => addToast(msg, 'info', duration ?? 3000),
        loading: (msg) => addToast(msg, 'loading', 0), // No auto-dismiss - must call dismiss
        saved: (msg, duration) => addToast(msg, 'saved', duration ?? 3000),
        upload: (msg, duration) => addToast(msg, 'upload', duration ?? 0), // No auto-dismiss by default
        processing: (msg, duration) => addToast(msg, 'processing', duration ?? 0), // No auto-dismiss by default
        dismiss: removeToast,
        update: updateToast
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${toastColors[t.type]} border backdrop-blur-xl shadow-2xl`}
                        >
                            {/* Icon */}
                            <div className={`flex-shrink-0 ${toastTextColors[t.type]}`}>
                                {toastIcons[t.type]}
                            </div>

                            {/* Message */}
                            <p className="text-sm font-medium text-white flex-1 pr-2">
                                {t.message}
                            </p>

                            {/* Dismiss button (for non-loading toasts) */}
                            {t.type !== 'loading' && t.type !== 'processing' && (
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            {/* Progress bar for auto-dismissing toasts */}
                            {t.type !== 'loading' && t.type !== 'processing' && (
                                <motion.div
                                    initial={{ scaleX: 1 }}
                                    animate={{ scaleX: 0 }}
                                    transition={{ duration: t.type === 'error' ? 5 : 3, ease: 'linear' }}
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${toastTextColors[t.type].replace('text-', 'bg-')}`}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export default ToastContext
