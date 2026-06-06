const BRAND = {
    primary: '#5a7a9e',
    primaryHover: '#4a6585',
    onPrimary: '#ffffff',
}

const TOKENS = {
    dark: {
        background: '#1a1a1d',
        backgroundSecondary: '#0f0f12',
        text: '#fafafa',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        border: 'rgba(255, 255, 255, 0.06)',
        borderHover: 'rgba(255, 255, 255, 0.1)',
        inputBg: '#0f0f12',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    light: {
        background: '#ffffff',
        backgroundSecondary: '#f4f4f5',
        text: '#18181b',
        textSecondary: '#52525b',
        textMuted: '#a1a1aa',
        border: 'rgba(0, 0, 0, 0.06)',
        borderHover: 'rgba(0, 0, 0, 0.1)',
        inputBg: '#fafaf9',
        shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    },
}

function getTokens(theme) {
    return TOKENS[theme === 'light' ? 'light' : 'dark']
}

function getAvatarElements() {
    return {
        userButtonAvatarBox: {
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '9999px',
            backgroundColor: BRAND.primary,
            color: BRAND.onPrimary,
            border: '2px solid rgba(90, 122, 158, 0.35)',
            boxShadow: 'none',
        },
        userButtonTrigger: {
            borderRadius: '9999px',
            '&:hover': {
                opacity: 0.92,
            },
            '&:focus': {
                boxShadow: '0 0 0 3px rgba(90, 122, 158, 0.28)',
            },
        },
        avatarBox: {
            backgroundColor: BRAND.primary,
            color: BRAND.onPrimary,
            border: '2px solid rgba(90, 122, 158, 0.35)',
        },
        userPreviewAvatarBox: {
            backgroundColor: BRAND.primary,
            color: BRAND.onPrimary,
            border: '2px solid rgba(90, 122, 158, 0.35)',
        },
        userPreviewAvatarContainer: {
            backgroundColor: 'transparent',
        },
    }
}

function getUserButtonPopoverElements(tokens) {
    return {
        userButtonPopoverCard: {
            backgroundColor: tokens.background,
            border: `1px solid ${tokens.border}`,
            borderRadius: '12px',
            boxShadow: tokens.shadow,
            overflow: 'hidden',
        },
        userButtonPopoverMain: {
            backgroundColor: tokens.background,
        },
        userButtonPopoverActions: {
            backgroundColor: tokens.background,
            borderTop: `1px solid ${tokens.border}`,
        },
        userButtonPopoverActionButton: {
            color: tokens.text,
            borderRadius: '8px',
            '&:hover': {
                backgroundColor: tokens.backgroundSecondary,
            },
        },
        userButtonPopoverActionButtonText: {
            color: tokens.text,
            fontWeight: 500,
        },
        userButtonPopoverActionButtonIcon: {
            color: tokens.textSecondary,
        },
        userButtonPopoverFooter: {
            backgroundColor: tokens.backgroundSecondary,
            backgroundImage: 'none',
            borderTop: `1px solid ${tokens.border}`,
        },
        userPreview: {
            backgroundColor: tokens.background,
        },
        userPreviewMainIdentifier: {
            color: tokens.text,
            fontWeight: 600,
        },
        userPreviewMainIdentifierText: {
            color: tokens.text,
        },
        userPreviewSecondaryIdentifier: {
            color: tokens.textSecondary,
        },
        userPreviewTextContainer: {
            color: tokens.text,
        },
    }
}

export function getUserButtonAppearance(theme) {
    const tokens = getTokens(theme)

    return {
        elements: {
            ...getAvatarElements(),
            ...getUserButtonPopoverElements(tokens),
        },
        variables: {
            colorPrimary: BRAND.primary,
            colorBackground: tokens.background,
            colorText: tokens.text,
            colorTextSecondary: tokens.textSecondary,
            colorNeutral: tokens.textSecondary,
            borderRadius: '10px',
        },
    }
}

export function getClerkAppearance(theme) {
    const tokens = getTokens(theme)

    return {
        variables: {
            colorPrimary: BRAND.primary,
            colorBackground: tokens.background,
            colorText: tokens.text,
            colorTextSecondary: tokens.textSecondary,
            colorInputBackground: tokens.inputBg,
            colorInputText: tokens.text,
            colorNeutral: tokens.textSecondary,
            borderRadius: '10px',
            fontFamily: 'Inter, system-ui, sans-serif',
        },
        elements: {
            ...getAvatarElements(),
            ...getUserButtonPopoverElements(tokens),
            card: {
                backgroundColor: tokens.background,
                border: `1px solid ${tokens.border}`,
                boxShadow: tokens.shadow,
            },
            headerTitle: {
                color: tokens.text,
            },
            headerSubtitle: {
                color: tokens.textSecondary,
            },
            socialButtonsBlockButton: {
                backgroundColor: tokens.backgroundSecondary,
                border: `1px solid ${tokens.borderHover}`,
                color: tokens.text,
                '&:hover': {
                    backgroundColor: tokens.inputBg,
                },
            },
            formFieldLabel: {
                color: tokens.textSecondary,
            },
            formFieldInput: {
                backgroundColor: tokens.inputBg,
                borderColor: tokens.borderHover,
                color: tokens.text,
                '&:focus': {
                    borderColor: BRAND.primary,
                    boxShadow: '0 0 0 3px rgba(90, 122, 158, 0.15)',
                },
            },
            formButtonPrimary: {
                backgroundColor: BRAND.primary,
                color: BRAND.onPrimary,
                '&:hover': {
                    backgroundColor: BRAND.primaryHover,
                },
            },
            footerActionLink: {
                color: BRAND.primary,
            },
            identityPreviewText: {
                color: tokens.text,
            },
            identityPreviewEditButton: {
                color: BRAND.primary,
            },
            formFieldHintText: {
                color: tokens.textMuted,
            },
            dividerLine: {
                backgroundColor: tokens.borderHover,
            },
            dividerText: {
                color: tokens.textMuted,
            },
        },
    }
}