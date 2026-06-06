import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { savePreferences, getCurrentUser } from '../utils/api'
import { Briefcase, Check, Code2, GraduationCap, Star } from 'lucide-react'
import { IconTile, ICON_STROKE } from '../components/IconTile'

// Animation variants
const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } }
}

const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' }
    }),
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
}

function Onboarding() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()
    const [step, setStep] = useState(1)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [preferences, setPreferences] = useState({
        portfolioType: '',
        experienceLevel: '',
        themePreference: ''
    })

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

        // Check if user needs onboarding
        const checkOnboarding = async () => {
            try {
                const { data } = await getCurrentUser()
                if (data.onboardingCompleted) {
                    navigate('/upload')
                }
            } catch (err) {
                if (err.response?.data?.needsRegistration) {
                    navigate('/username')
                }
            }
        }
        checkOnboarding()
    }, [isLoaded, isSignedIn, navigate])

    const handleSelect = (field, value) => {
        setPreferences(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleComplete = async () => {
        setSaving(true)
        setError('')
        try {
            await savePreferences(preferences)
            navigate('/upload')
        } catch (err) {
            setError('Failed to save preferences. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1: return !!preferences.portfolioType
            case 2: return !!preferences.experienceLevel
            case 3: return !!preferences.themePreference
            default: return false
        }
    }

    const portfolioTypes = [
        {
            id: 'technical',
            icon: Code2,
            title: 'Technical Portfolio',
            description: 'For developers, engineers, designers',
            examples: 'GitHub repos, coding projects, tech skills',
        },
        {
            id: 'non-technical',
            icon: Briefcase,
            title: 'General Portfolio',
            description: 'For business, creative, academic roles',
            examples: 'Work experience, publications, achievements',
        }
    ]

    const experienceLevels = [
        {
            id: 'fresher',
            icon: GraduationCap,
            title: 'Fresher / Student',
            description: '0-2 years of experience',
            highlights: 'Education, projects, internships, skills',
        },
        {
            id: 'experienced',
            icon: Star,
            title: 'Experienced Professional',
            description: '2+ years of work experience',
            highlights: 'Career growth, leadership, achievements',
        }
    ]

    const themes = [
        { id: 'modern', name: 'Modern', colors: ['#5a7a9e', '#7a96b5'], bg: '#09090b' },
        { id: 'minimal', name: 'Minimal', colors: ['#18181b', '#3f3f46'], bg: '#ffffff' },
        { id: 'creative', name: 'Creative', colors: ['#ec4899', '#f472b6'], bg: '#1f1f1f' },
        { id: 'professional', name: 'Professional', colors: ['#0f766e', '#14b8a6'], bg: '#f0fdfa' }
    ]

    return (
        <div className="min-h-screen pt-navbar pb-12 px-4 overflow-x-clip">
            <div className="max-w-4xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center">
                                <motion.div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s
                                            ? 'text-white'
                                            : 'bg-surface text-muted border border-border'
                                        }`}
                                    style={step >= s ? { background: 'var(--gradient-primary)' } : {}}
                                    animate={{ scale: step === s ? 1.1 : 1 }}
                                >
                                    {step > s ? <Check size={16} strokeWidth={ICON_STROKE} /> : s}
                                </motion.div>
                                {s < 3 && (
                                    <div
                                        className={`hidden sm:block w-24 md:w-40 h-1 mx-2 rounded transition-all ${step > s ? 'bg-primary-500' : 'bg-border'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-secondary">
                        Step {step} of 3 — {step === 1 ? 'Portfolio Type' : step === 2 ? 'Experience Level' : 'Theme'}
                    </p>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Portfolio Type */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-primary mb-4">
                                What type of portfolio is this for?
                            </h1>
                            <p className="text-center text-secondary mb-12 max-w-2xl mx-auto">
                                This helps us show the right sections and optimize your portfolio for your field.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                {portfolioTypes.map((type, i) => (
                                    <motion.button
                                        type="button"
                                        key={type.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        whileTap="tap"
                                        custom={i}
                                        onClick={() => handleSelect('portfolioType', type.id)}
                                        aria-pressed={preferences.portfolioType === type.id}
                                        className={`relative glass-card rounded-3xl p-8 cursor-pointer transition-all overflow-hidden hover:bg-surface-hover w-full text-left ${preferences.portfolioType === type.id
                                                ? 'ring-2 ring-primary-500/40'
                                                : ''
                                            }`}
                                    >
                                        {/* Selected indicator */}
                                        {preferences.portfolioType === type.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
                                            >
                                                <Check size={16} strokeWidth={ICON_STROKE} />
                                            </motion.div>
                                        )}

                                        <IconTile icon={type.icon} className="w-14 h-14 mb-6" size={24} />

                                        <h3 className="text-xl font-bold text-primary mb-2">{type.title}</h3>
                                        <p className="text-secondary mb-4">{type.description}</p>
                                        <p className="text-sm text-muted">
                                            <span className="font-medium">Examples:</span> {type.examples}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Experience Level */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-primary mb-4">
                                What's your experience level?
                            </h1>
                            <p className="text-center text-secondary mb-12 max-w-2xl mx-auto">
                                We'll prioritize the right sections based on where you are in your career.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                {experienceLevels.map((level, i) => (
                                    <motion.button
                                        type="button"
                                        key={level.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        whileTap="tap"
                                        custom={i}
                                        onClick={() => handleSelect('experienceLevel', level.id)}
                                        aria-pressed={preferences.experienceLevel === level.id}
                                        className={`relative glass-card rounded-3xl p-8 cursor-pointer transition-all hover:bg-surface-hover w-full text-left ${preferences.experienceLevel === level.id
                                                ? 'ring-2 ring-primary-500/40'
                                                : ''
                                            }`}
                                    >
                                        {preferences.experienceLevel === level.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
                                            >
                                                <Check size={16} strokeWidth={ICON_STROKE} />
                                            </motion.div>
                                        )}

                                        <IconTile icon={level.icon} className="w-14 h-14 mb-6" size={24} />

                                        <h3 className="text-xl font-bold text-primary mb-2">{level.title}</h3>
                                        <p className="text-secondary mb-4">{level.description}</p>
                                        <p className="text-sm text-muted">
                                            <span className="font-medium">Highlights:</span> {level.highlights}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Theme Selection */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h1 className="text-3xl md:text-4xl font-display font-bold text-center text-primary mb-4">
                                Choose your portfolio theme
                            </h1>
                            <p className="text-center text-secondary mb-12 max-w-2xl mx-auto">
                                Pick a style that represents you. You can change this anytime in settings.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                {themes.map((theme, i) => (
                                    <motion.button
                                        type="button"
                                        key={theme.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        whileTap="tap"
                                        custom={i}
                                        onClick={() => handleSelect('themePreference', theme.id)}
                                        aria-pressed={preferences.themePreference === theme.id}
                                        className={`relative cursor-pointer transition-all w-full text-left ${preferences.themePreference === theme.id
                                                ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-background'
                                                : ''
                                            }`}
                                    >
                                        {/* Theme preview */}
                                        <div
                                            className="aspect-[3/4] rounded-2xl overflow-hidden mb-3"
                                            style={{ background: theme.bg }}
                                        >
                                            <div className="p-4 h-full flex flex-col">
                                                {/* Mini header */}
                                                <div
                                                    className="w-10 h-10 rounded-full mb-3"
                                                    style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                                                />
                                                {/* Mini lines */}
                                                <div
                                                    className="h-2 rounded mb-2"
                                                    style={{ background: theme.id === 'minimal' ? '#e4e4e7' : 'rgba(255,255,255,0.2)', width: '70%' }}
                                                />
                                                <div
                                                    className="h-2 rounded mb-4"
                                                    style={{ background: theme.id === 'minimal' ? '#e4e4e7' : 'rgba(255,255,255,0.1)', width: '50%' }}
                                                />
                                                {/* Mini cards */}
                                                <div className="flex-1 space-y-2">
                                                    {[1, 2, 3].map((n) => (
                                                        <div
                                                            key={n}
                                                            className="h-8 rounded-lg"
                                                            style={{ background: theme.id === 'minimal' ? '#f4f4f5' : 'rgba(255,255,255,0.05)' }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-center font-medium text-primary">{theme.name}</p>

                                        {preferences.themePreference === theme.id && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs"
                                            >
                                                <Check size={14} strokeWidth={ICON_STROKE} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error message */}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-red-400 mt-6"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between items-center mt-12 max-w-3xl mx-auto">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${step === 1
                                ? 'opacity-0 pointer-events-none'
                                : 'text-secondary hover:text-primary'
                            }`}
                    >
                        ← Back
                    </button>

                    <motion.button
                        whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                        whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                        onClick={handleNext}
                        disabled={!canProceed() || saving}
                        className={`px-8 py-3 rounded-xl font-medium transition-all ${canProceed()
                                ? 'btn-primary'
                                : 'bg-surface text-muted cursor-not-allowed'
                            }`}
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : step === 3 ? (
                            'Complete Setup →'
                        ) : (
                            'Continue →'
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
