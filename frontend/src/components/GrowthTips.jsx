import { useMemo, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { getPortfolioUrl } from '../utils/appUrl'
import {
    getResumeLinkLine,
    getShareContent,
    openShareWindow,
} from '../utils/sharePosts'

function GrowthTips({ username, basicDetails, profile }) {
    const toast = useToast()
    const [copiedTip, setCopiedTip] = useState('')

    const shareData = useMemo(
        () => ({ username, basicDetails, profile }),
        [username, basicDetails, profile],
    )

    const linkedinShare = useMemo(
        () => getShareContent('linkedin', shareData),
        [shareData],
    )

    const twitterShare = useMemo(
        () => getShareContent('twitter', shareData),
        [shareData],
    )

    const resumeLine = username ? getResumeLinkLine(username) : ''

    const handleShare = async (url) => {
        if (openShareWindow(url)) {
            return
        }

        const portfolioUrl = username ? getPortfolioUrl(username) : ''
        if (portfolioUrl && navigator?.clipboard) {
            try {
                await navigator.clipboard.writeText(portfolioUrl)
                toast.error('Popup blocked. Portfolio link copied to your clipboard instead.')
                return
            } catch {
                // fall through to generic message
            }
        }

        toast.error('Popup blocked. Allow popups for this site or copy your portfolio link from the dashboard.')
    }

    const copyResumeLine = async () => {
        if (!resumeLine || !navigator?.clipboard) {
            toast.error('Copy is not available in this browser.')
            return
        }

        try {
            await navigator.clipboard.writeText(resumeLine)
            setCopiedTip('resume')
            setTimeout(() => setCopiedTip(''), 2000)
        } catch {
            toast.error('Could not copy to clipboard. Please try again.')
        }
    }

    const tips = [
        {
            id: 'linkedin',
            title: 'Share on LinkedIn',
            desc: 'Professional networks drive the most relevant traffic to portfolios.',
            disabled: !linkedinShare,
            onClick: () => handleShare(linkedinShare?.url),
        },
        {
            id: 'twitter',
            title: 'Share on X',
            desc: 'Post a ready-made update and reach a wider audience in seconds.',
            disabled: !twitterShare,
            onClick: () => handleShare(twitterShare?.url),
        },
        {
            id: 'resume',
            title: 'Add to resume',
            desc: 'Include your portfolio link to stand out from other applicants.',
            disabled: !resumeLine,
            onClick: copyResumeLine,
        },
    ]

    return (
        <div className="space-y-3">
            {tips.map((tip) => (
                <button
                    key={tip.id}
                    type="button"
                    disabled={tip.disabled}
                    onClick={tip.onClick}
                    className="w-full p-4 bg-tertiary rounded-xl text-left transition-colors hover:bg-surface-hover disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-tertiary"
                >
                    <p className="text-secondary text-sm">
                        <strong className="text-primary">{tip.title}</strong>
                        {' '}
                        — {tip.desc}
                        {copiedTip === tip.id && (
                            <span className="text-success font-medium"> Copied!</span>
                        )}
                    </p>
                </button>
            ))}
        </div>
    )
}

export default GrowthTips
