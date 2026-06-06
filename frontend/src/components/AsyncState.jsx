import { AlertTriangle } from 'lucide-react'
import { ICON_STROKE } from './IconTile'

export function LoadingState({ className = 'min-h-[60vh]', message }) {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`} role="status" aria-live="polite">
            <div className="spinner w-8 h-8" />
            {message && <p className="text-secondary text-sm mt-4">{message}</p>}
        </div>
    )
}

export function ErrorState({
    title = 'Something went wrong',
    message,
    onRetry,
    retryLabel = 'Try Again',
}) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="glass-card rounded-2xl p-8 text-center max-w-md w-full">
                <div className="w-14 h-14 rounded-xl bg-tertiary flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={24} strokeWidth={ICON_STROKE} className="text-warning" />
                </div>
                <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
                {message && <p className="text-secondary mb-6">{message}</p>}
                {onRetry && (
                    <button type="button" onClick={onRetry} className="btn-primary w-full justify-center">
                        {retryLabel}
                    </button>
                )}
            </div>
        </div>
    )
}