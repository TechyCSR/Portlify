import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { checkUsername, registerUser, getCurrentUser } from '../utils/api'

function UsernameSelection() {
    const { user } = useUser()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [isAvailable, setIsAvailable] = useState(null)
    const [isChecking, setIsChecking] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Check if user already has a username
    useEffect(() => {
        const checkExistingUser = async () => {
            try {
                const { data } = await getCurrentUser()
                if (data?.username) {
                    navigate('/upload')
                }
            } catch (err) {
                // User doesn't exist yet, that's fine
            }
        }
        checkExistingUser()
    }, [navigate])

    // Debounced username check
    useEffect(() => {
        if (!username || username.length < 3) {
            setIsAvailable(null)
            return
        }

        const timer = setTimeout(async () => {
            setIsChecking(true)
            try {
                const { data } = await checkUsername(username)
                setIsAvailable(data.available)
                setError(data.error || '')
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to check username')
                setIsAvailable(false)
            } finally {
                setIsChecking(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [username])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isAvailable || isSubmitting) return

        setIsSubmitting(true)
        setError('')

        try {
            await registerUser({
                username,
                email: user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress
            })
            navigate('/upload')
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register username')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass-card rounded-3xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-display font-bold text-white mb-2">
                            Choose Your Username
                        </h1>
                        <p className="text-dark-400">
                            This will be your unique portfolio URL
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Username preview */}
                        <div className="mb-6 p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                            <p className="text-dark-400 text-sm mb-1">Your portfolio URL</p>
                            <p className="text-lg font-medium">
                                <span className="text-dark-500">portlify.techycsr.dev/</span>
                                <span className="text-primary-400">{username || 'username'}</span>
                            </p>
                        </div>

                        {/* Username input */}
                        <div className="mb-6">
                            <label className="block text-dark-300 text-sm font-medium mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                    placeholder="johndoe"
                                    className="input-field pr-12"
                                    maxLength={30}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isChecking && <div className="spinner w-5 h-5" />}
                                    {!isChecking && isAvailable === true && (
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {!isChecking && isAvailable === false && (
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Status message */}
                            {username.length > 0 && username.length < 3 && (
                                <p className="mt-2 text-sm text-dark-400">
                                    Username must be at least 3 characters
                                </p>
                            )}
                            {isAvailable === true && (
                                <p className="mt-2 text-sm text-green-400">
                                    Username is available!
                                </p>
                            )}
                            {error && (
                                <p className="mt-2 text-sm text-red-400">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={!isAvailable || isSubmitting}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <div className="spinner w-5 h-5 mr-2" />
                                    Creating...
                                </span>
                            ) : (
                                'Claim Username'
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default UsernameSelection
