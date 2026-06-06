import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UploadZone from '../components/UploadZone'
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload'
import { parseResume, getCurrentUser } from '../utils/api'
import { useToast } from '../context/ToastContext'
import { Check, CheckCircle, Info } from 'lucide-react'
import { IconTile, InlineIcon, ICON_STROKE } from '../components/IconTile'
import PageHeader from '../components/PageHeader'

function ResumeUpload() {
    const navigate = useNavigate()
    const { upload, uploading, progress, error: uploadError } = useCloudinaryUpload()
    const toast = useToast()
    const [status, setStatus] = useState('idle') // idle, uploading, parsing, success, error
    const [error, setError] = useState('')
    const [parsingMessage, setParsingMessage] = useState('')

    // Check if user has registered username
    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser()
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                }
            }
        }
        checkUser()
    }, [navigate])

    const handleFileSelect = async (file) => {
        setError('')
        setStatus('uploading')

        const uploadToastId = toast.upload('Uploading your resume...')
        let processingToastId = null

        try {
            // Upload to Cloudinary
            const { url } = await upload(file)

            toast.dismiss(uploadToastId)
            processingToastId = toast.processing('Analyzing your resume with AI...')

            setStatus('parsing')
            setParsingMessage('Analyzing your resume with AI...')

            // Parse with Gemini AI
            const { data } = await parseResume(url)

            setParsingMessage('Extracting your skills and experience...')

            // Store parsed data and resume URL in session storage for editor
            sessionStorage.setItem('parsedResumeData', JSON.stringify({
                ...data.data,
                resumeUrl: url
            }))

            setStatus('success')
            setParsingMessage('Done! Redirecting to editor...')

            // Dismiss processing toast before showing success
            if (processingToastId) toast.dismiss(processingToastId)
            toast.success('Resume analyzed successfully!')

            // Redirect to profile editor
            setTimeout(() => {
                navigate('/editor')
            }, 1500)
        } catch (err) {
            // Dismiss any active toasts
            toast.dismiss(uploadToastId)
            if (processingToastId) toast.dismiss(processingToastId)

            toast.error(err.response?.data?.error || err.message || 'Upload failed')
            setError(err.response?.data?.error || err.message || 'Upload failed')
            setStatus('error')
        }
    }

    return (
        <div className="max-w-2xl mx-auto pb-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <PageHeader
                    title="Upload Your Resume"
                    description="Our AI will analyze your resume and extract all the important details"
                />
            </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {status === 'idle' || status === 'error' ? (
                        <UploadZone
                            onFileSelect={handleFileSelect}
                            uploading={false}
                            progress={0}
                        />
                    ) : status === 'uploading' ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <div className="spinner mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-primary mb-2">
                                Uploading Resume...
                            </h3>
                            <p className="text-secondary">{progress}% complete</p>
                        </div>
                    ) : status === 'parsing' ? (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary-500/30 border-t-primary-500"
                            />
                            <h3 className="text-xl font-semibold text-primary mb-2">
                                AI Processing...
                            </h3>
                            <p className="text-secondary">
                                {parsingMessage}
                            </p>
                            <div className="mt-6 flex justify-center gap-2">
                                {['Skills', 'Experience', 'Education', 'Projects'].map((item, i) => (
                                    <motion.span
                                        key={item}
                                        initial={{ opacity: 0.3 }}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                        className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm"
                                    >
                                        {item}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    ) : status === 'success' ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card rounded-2xl p-12 text-center"
                        >
                            <IconTile icon={Check} className="w-16 h-16 mx-auto mb-6" size={28} />
                            <h3 className="text-xl font-semibold text-primary mb-2">
                                Resume Analyzed!
                            </h3>
                            <p className="text-secondary mb-4">
                                {parsingMessage}
                            </p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {['Profile Extracted', 'Skills Identified', 'Projects Found'].map((label) => (
                                    <span key={label} className="px-3 py-1 rounded-md bg-tertiary text-secondary text-sm">
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ) : null}

                    {/* Error message */}
                    {(error || uploadError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                        >
                            <p className="text-red-400 text-center">
                                {error || uploadError}
                            </p>
                            <button
                                onClick={() => {
                                    setError('')
                                    setStatus('idle')
                                }}
                                className="mt-4 w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 glass rounded-2xl p-6"
                >
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-3">
                        <IconTile icon={Info} className="w-8 h-8" size={16} />
                        Tips for Best Results
                    </h3>
                    <ul className="space-y-3 text-secondary">
                        {[
                            'Include links to your projects, GitHub, and LinkedIn in your resume',
                            'Use clear section headers like "Experience", "Education", "Projects"',
                            "You'll be able to review and edit all extracted information",
                        ].map((tip) => (
                            <li key={tip} className="flex items-start gap-3">
                                <CheckCircle size={16} strokeWidth={ICON_STROKE} className="text-secondary mt-0.5 flex-shrink-0" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </motion.div>
        </div>
    )
}

export default ResumeUpload
