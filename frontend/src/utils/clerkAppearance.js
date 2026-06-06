export function getUserButtonAppearance(theme) {
    return {
        elements: {
            avatarBox: 'w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-primary-500/30 ring-offset-2 ring-offset-transparent',
            userButtonPopoverCard: {
                backgroundColor: theme === 'dark' ? '#1a1a1d' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: theme === 'dark'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            },
            userButtonPopoverActionButton: {
                color: theme === 'dark' ? '#fafafa' : '#18181b',
                '&:hover': {
                    backgroundColor: theme === 'dark' ? '#0f0f12' : '#f4f4f5',
                },
            },
            userButtonPopoverActionButtonText: {
                color: theme === 'dark' ? '#fafafa' : '#18181b',
            },
            userButtonPopoverActionButtonIcon: {
                color: theme === 'dark' ? '#a1a1aa' : '#52525b',
            },
            userPreviewMainIdentifier: {
                color: theme === 'dark' ? '#fafafa' : '#18181b',
            },
            userPreviewSecondaryIdentifier: {
                color: theme === 'dark' ? '#a1a1aa' : '#52525b',
            },
        },
        variables: {
            colorPrimary: '#5a7a9e',
            colorBackground: theme === 'dark' ? '#1a1a1d' : '#ffffff',
            colorText: theme === 'dark' ? '#fafafa' : '#18181b',
        },
    }
}

export function getClerkAppearance(theme) {
    return {
        baseTheme: theme === 'dark' ? undefined : undefined,
        variables: {
            colorPrimary: '#5a7a9e',
            colorBackground: theme === 'dark' ? '#1a1a1d' : '#ffffff',
            colorText: theme === 'dark' ? '#fafafa' : '#18181b',
            colorTextSecondary: theme === 'dark' ? '#a1a1aa' : '#52525b',
            colorInputBackground: theme === 'dark' ? '#18181b' : '#f4f4f5',
            colorInputText: theme === 'dark' ? '#fafafa' : '#18181b',
            colorNeutral: theme === 'dark' ? '#a1a1aa' : '#52525b',
            borderRadius: '10px',
            fontFamily: 'Inter, system-ui, sans-serif',
        },
        elements: {
            ...getUserButtonAppearance(theme).elements,
            rootBox: {
                boxShadow: theme === 'dark'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            },
            card: {
                backgroundColor: theme === 'dark' ? '#1a1a1d' : '#ffffff',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                boxShadow: 'none',
            },
            headerTitle: {
                color: theme === 'dark' ? '#fafafa' : '#18181b',
            },
            headerSubtitle: {
                color: theme === 'dark' ? '#a1a1aa' : '#52525b',
            },
            socialButtonsBlockButton: {
                backgroundColor: theme === 'dark' ? '#0f0f12' : '#fafaf9',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                color: theme === 'dark' ? '#fafafa' : '#18181b',
                '&:hover': {
                    backgroundColor: theme === 'dark' ? '#18181b' : '#f4f4f5',
                },
            },
            formFieldLabel: {
                color: theme === 'dark' ? '#a1a1aa' : '#52525b',
            },
            formFieldInput: {
                backgroundColor: theme === 'dark' ? '#0f0f12' : '#fafaf9',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                color: theme === 'dark' ? '#fafafa' : '#18181b',
                '&:focus': {
                    borderColor: '#5a7a9e',
                    boxShadow: '0 0 0 3px rgba(90, 122, 158, 0.15)',
                },
            },
            formButtonPrimary: {
                background: '#5a7a9e',
                '&:hover': {
                    background: '#4a6585',
                },
            },
            footerActionLink: {
                color: '#5a7a9e',
            },
            identityPreviewText: {
                color: theme === 'dark' ? '#fafafa' : '#18181b',
            },
            identityPreviewEditButton: {
                color: '#5a7a9e',
            },
            formFieldHintText: {
                color: theme === 'dark' ? '#71717a' : '#a1a1aa',
            },
            dividerLine: {
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
            dividerText: {
                color: theme === 'dark' ? '#71717a' : '#a1a1aa',
            },
        },
    }
}