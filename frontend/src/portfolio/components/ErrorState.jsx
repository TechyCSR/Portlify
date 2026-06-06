import { User } from 'lucide-react'
import { ICON_STROKE } from '../../components/IconTile'
import { getCssVars } from '../theme'

function ErrorState({ colors, message }) {
    return (
        <div
            className="min-h-dvh flex items-center justify-center px-4"
            style={{
                background: colors.bg,
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            <div
                className="portfolio-surface rounded-2xl p-8 text-center max-w-md w-full"
                style={getCssVars(colors)}
            >
                <div
                    className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(239, 68, 68, 0.12)' }}
                >
                    <User size={28} strokeWidth={ICON_STROKE} className="text-red-400" />
                </div>
                <h1 className="text-xl font-semibold mb-2 portfolio-text">{message}</h1>
                <p className="text-sm portfolio-text-secondary">
                    The portfolio you&apos;re looking for doesn&apos;t exist or isn&apos;t available.
                </p>
            </div>
        </div>
    )
}

export default ErrorState