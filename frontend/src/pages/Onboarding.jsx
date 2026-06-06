import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { savePreferences, getCurrentUser } from '../utils/api'
import { Briefcase, Code2, GraduationCap, Star } from 'lucide-react'
import OnboardingProgress from '../components/onboarding/OnboardingProgress'
import OnboardingOptionCard from '../components/onboarding/OnboardingOptionCard'
import OnboardingThemeCard from '../components/onboarding/OnboardingThemeCard'
import { PORTFOLIO_THEME_OPTIONS } from '../portfolio/theme'

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

function OnboardingStepHeader({ title, description }) {
    return (
        <header className="text-center mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-3 sm:mb-4 leading-tight">
                {title}
            </h1>
            <p className="text-sm sm:text-base text-secondary leading-relaxed">
                {description}
            </p>
        </header>
    )
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
        themePreference: '',
    })

    useEffect(() => {
        if (!isLoaded) return
        if (!isSignedIn) {
            navigate('/')
            return
        }

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
        setPreferences((prev) => ({ ...prev, [field]: value }))
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
        } catch {
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
        },
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
        },
    ]

    return (
        <div className="min-h-screen pt-navbar pb-8 sm:pb-12 px-4 sm:px-6 overflow-x-clip">
            <div className="max-w-4xl mx-auto">
                <OnboardingProgress step={step} />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <OnboardingStepHeader
                                title="What type of portfolio is this for?"
                                description="This helps us show the right sections and optimize your portfolio for your field."
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-3xl mx-auto">
                                {portfolioTypes.map((type, i) => (
                                    <OnboardingOptionCard
                                        key={type.id}
                                        index={i}
                                        icon={type.icon}
                                        title={type.title}
                                        description={type.description}
                                        footer={type.examples}
                                        footerLabel="Examples"
                                        selected={preferences.portfolioType === type.id}
                                        onSelect={() => handleSelect('portfolioType', type.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <OnboardingStepHeader
                                title="What's your experience level?"
                                description="We'll prioritize the right sections based on where you are in your career."
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-3xl mx-auto">
                                {experienceLevels.map((level, i) => (
                                    <OnboardingOptionCard
                                        key={level.id}
                                        index={i}
                                        icon={level.icon}
                                        title={level.title}
                                        description={level.description}
                                        footer={level.highlights}
                                        footerLabel="Highlights"
                                        selected={preferences.experienceLevel === level.id}
                                        onSelect={() => handleSelect('experienceLevel', level.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <OnboardingStepHeader
                                title="Choose your portfolio theme"
                                description="Pick a style that represents you. You can change this anytime in settings."
                            />

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                                {PORTFOLIO_THEME_OPTIONS.map((theme, i) => (
                                    <OnboardingThemeCard
                                        key={theme.id}
                                        index={i}
                                        theme={theme}
                                        selected={preferences.themePreference === theme.id}
                                        onSelect={() => handleSelect('themePreference', theme.id)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-error text-sm mt-6"
                        role="alert"
                    >
                        {error}
                    </motion.p>
                )}

                <div className="mt-8 sm:mt-10 lg:mt-12 max-w-3xl mx-auto">
                    <div className={`flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 ${step === 1 ? 'sm:justify-end' : 'sm:justify-between'}`}>
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-secondary hover:text-primary border border-border hover:border-border-hover bg-surface transition-colors min-h-[44px]"
                            >
                                ← Back
                            </button>
                        )}

                        <motion.button
                            type="button"
                            whileHover={{ scale: canProceed() && !saving ? 1.01 : 1 }}
                            whileTap={{ scale: canProceed() && !saving ? 0.99 : 1 }}
                            onClick={handleNext}
                            disabled={!canProceed() || saving}
                            className={[
                                'w-full sm:w-auto sm:min-w-[12rem] px-8 py-3 rounded-xl font-medium transition-all min-h-[44px]',
                                canProceed() && !saving
                                    ? 'btn-primary justify-center'
                                    : 'bg-surface text-muted border border-border cursor-not-allowed',
                            ].join(' ')}
                        >
                            {saving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
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
        </div>
    )
}

export default Onboarding