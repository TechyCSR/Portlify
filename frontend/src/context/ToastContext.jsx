import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Check,
    Info,
    Loader2,
    Save,
    Sparkles,
    Upload,
    X,
} from 'lucide-react'
import { ICON_STROKE, InlineIcon } from '../components/IconTile'

const ToastContext = createContext(null)

const toastTypeStyles = {
    success: {
        border: 'border-l-[var(--color-success)]',
        iconClass: 'text-[var(--color-success)]',
    },
    saved: {
        border: 'border-l-[var(--color-success)]',
        iconClass: 'text-[var(--color-success)]',
    },
    upload: {
        border: 'border-l-[var(--color-primary-500)]',
        iconClass: 'text-primary-400',
    },
    error: {
        border: 'border-l-[var(--color-error)]',
        iconClass: 'text-[var(--color-error)]',
    },
    info: {
        border: 'border-l-[var(--color-primary-500)]',
        iconClass: 'text-primary-400',
    },
    loading: {
        border: 'border-l-[var(--color-primary-500)]',
        iconClass: 'text-primary-400',
    },
    processing: {
        border: 'border-l-[var(--color-primary-500)]',
        iconClass: 'text-primary-400',
    },
}

const toastIcons = {
    success: (className) => <InlineIcon icon={Check} size={16} className={className} />,
    error: (className) => <InlineIcon icon={X} size={16} className={className} />,
    info: (className) => <InlineIcon icon={Info} size={16} className={className} />,
    loading: (className) => <Loader2 size={16} strokeWidth={ICON_STROKE} className={`flex-shrink-0 animate-spin ${className}`} />,
    saved: (className) => <InlineIcon icon={Save} size={16} className={className} />,
    upload: (className) => <InlineIcon icon={Upload} size={16} className={className} />,
    processing: (className) => <InlineIcon icon={Sparkles} size={16} className={className} />,
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

    const toast = {
        success: (msg, duration) => addToast(msg, 'success', duration ?? 3000),
        error: (msg, duration) => addToast(msg, 'error', duration ?? 5000),
        info: (msg, duration) => addToast(msg, 'info', duration ?? 3000),
        loading: (msg) => addToast(msg, 'loading', 0),
        saved: (msg, duration) => addToast(msg, 'saved', duration ?? 3000),
        upload: (msg, duration) => addToast(msg, 'upload', duration ?? 0),
        processing: (msg, duration) => addToast(msg, 'processing', duration ?? 0),
        dismiss: removeToast,
        update: updateToast
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]"
            >
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => {
                        const styles = toastTypeStyles[t.type] || toastTypeStyles.info
                        const renderIcon = toastIcons[t.type] || toastIcons.info

                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-surface backdrop-blur-xl shadow-lg border-l-[3px] ${styles.border}`}
                            >
                                <div className="flex-shrink-0">
                                    {renderIcon(styles.iconClass)}
                                </div>

                                <p className="text-sm font-medium text-primary flex-1 pr-2">
                                    {t.message}
                                </p>

                                {t.type !== 'loading' && t.type !== 'processing' && (
                                    <button
                                        type="button"
                                        onClick={() => removeToast(t.id)}
                                        aria-label="Dismiss notification"
                                        className="flex-shrink-0 p-1 rounded-lg hover:bg-tertiary text-muted hover:text-primary transition-colors"
                                    >
                                        <X size={14} strokeWidth={ICON_STROKE} />
                                    </button>
                                )}

                                {t.type !== 'loading' && t.type !== 'processing' && (
                                    <motion.div
                                        initial={{ scaleX: 1 }}
                                        animate={{ scaleX: 0 }}
                                        transition={{ duration: t.type === 'error' ? 5 : 3, ease: 'linear' }}
                                        className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                                            t.type === 'error'
                                                ? 'bg-[var(--color-error)]/40'
                                                : t.type === 'success' || t.type === 'saved'
                                                    ? 'bg-[var(--color-success)]/40'
                                                    : 'bg-primary-500/40'
                                        }`}
                                    />
                                )}
                            </motion.div>
                        )
                    })}
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