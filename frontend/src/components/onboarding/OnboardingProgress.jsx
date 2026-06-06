import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { ICON_STROKE } from '../IconTile'

export const ONBOARDING_STEPS = [
    { id: 1, label: 'Portfolio Type', shortLabel: 'Type' },
    { id: 2, label: 'Experience', shortLabel: 'Level' },
    { id: 3, label: 'Theme', shortLabel: 'Theme' },
]

function OnboardingProgress({ step }) {
    const currentStep = ONBOARDING_STEPS[step - 1]
    const progressPercent = ((step - 1) / (ONBOARDING_STEPS.length - 1)) * 100

    return (
        <nav className="mb-8 sm:mb-10" aria-label="Onboarding progress">
            <div className="mb-5 sm:mb-6 px-1">
                <div
                    className="h-1 rounded-full bg-border overflow-hidden"
                    role="progressbar"
                    aria-valuenow={step}
                    aria-valuemin={1}
                    aria-valuemax={ONBOARDING_STEPS.length}
                    aria-label={`Step ${step} of ${ONBOARDING_STEPS.length}`}
                >
                    <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${progressPercent}%`,
                            background: 'var(--gradient-primary)',
                        }}
                    />
                </div>
            </div>

            <ol className="flex items-start w-full max-w-md sm:max-w-lg mx-auto px-1">
                {ONBOARDING_STEPS.map((item, index) => {
                    const isComplete = step > item.id
                    const isCurrent = step === item.id

                    return (
                        <Fragment key={item.id}>
                            {index > 0 && (
                                <li
                                    className="flex-1 h-0.5 mt-[1.125rem] sm:mt-5 mx-1.5 sm:mx-2 rounded-full bg-border overflow-hidden list-none min-w-[1.5rem]"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: step > index ? '100%' : '0%',
                                            background: 'var(--color-primary-500)',
                                        }}
                                    />
                                </li>
                            )}

                            <li className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0 list-none">
                                <div
                                    className={[
                                        'w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300',
                                        isComplete
                                            ? 'border-primary-500 bg-primary-500 text-white'
                                            : isCurrent
                                                ? 'border-primary-500 bg-surface text-primary-500 shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.12)]'
                                                : 'border-border bg-surface text-muted',
                                    ].join(' ')}
                                    aria-current={isCurrent ? 'step' : undefined}
                                >
                                    {isComplete ? (
                                        <Check size={16} strokeWidth={ICON_STROKE} aria-hidden="true" />
                                    ) : (
                                        <span>{item.id}</span>
                                    )}
                                </div>

                                <span
                                    className={[
                                        'text-[10px] sm:text-xs font-medium text-center leading-tight w-[3.25rem] sm:w-auto sm:min-w-[4.5rem]',
                                        isCurrent ? 'text-primary' : isComplete ? 'text-secondary' : 'text-muted',
                                    ].join(' ')}
                                >
                                    <span className="sm:hidden">{item.shortLabel}</span>
                                    <span className="hidden sm:inline">{item.label}</span>
                                </span>
                            </li>
                        </Fragment>
                    )
                })}
            </ol>

            <p className="text-center text-sm text-secondary mt-4 sm:mt-5">
                Step {step} of {ONBOARDING_STEPS.length}
                <span className="text-muted mx-1.5" aria-hidden="true">·</span>
                <span className="text-primary font-medium">{currentStep?.label}</span>
            </p>
        </nav>
    )
}

export default OnboardingProgress