export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0'
}

function getLuminance(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return 0
    const [r, g, b] = [result[1], result[2], result[3]].map((v) => parseInt(v, 16) / 255)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const PORTFOLIO_PALETTES = {
    modern: { primary: '#5a7a9e', secondary: '#7a96b5' },
    minimal: { primary: '#3f3f46', secondary: '#71717a' },
    creative: { primary: '#db2777', secondary: '#7c3aed' },
    professional: { primary: '#0f766e', secondary: '#0e7490' },
}

export const PORTFOLIO_THEME_OPTIONS = [
    { id: 'modern', name: 'Modern', previewBg: '#09090b', isLight: false },
    { id: 'minimal', name: 'Minimal', previewBg: '#fafaf9', isLight: true },
    { id: 'creative', name: 'Creative', previewBg: '#09090b', isLight: false },
    { id: 'professional', name: 'Professional', previewBg: '#fafaf9', isLight: true },
]

const PALETTES = PORTFOLIO_PALETTES

const NEUTRALS = {
    dark: {
        bg: '#09090b',
        surface: '#141416',
        surfaceRaised: '#1c1c1f',
        border: '#27272a',
        borderSubtle: '#1f1f23',
        text: '#fafafa',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
        shadowSm: '0 1px 2px rgba(0, 0, 0, 0.24)',
    },
    light: {
        bg: '#fafaf9',
        surface: '#ffffff',
        surfaceRaised: '#f4f4f5',
        border: '#e4e4e7',
        borderSubtle: '#f0f0f2',
        text: '#18181b',
        textSecondary: '#52525b',
        textMuted: '#a1a1aa',
        shadowSm: '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
    },
}

export function getThemeColors(themeName, mode) {
    const palette = { ...(PALETTES[themeName] || PALETTES.modern) }
    const isDark = mode === 'dark'
    const neutral = NEUTRALS[isDark ? 'dark' : 'light']

    if (themeName === 'minimal' && isDark) {
        palette.primary = '#e4e4e7'
        palette.secondary = '#a1a1aa'
    }

    const primaryRgb = hexToRgb(palette.primary)
    const accentSoft = isDark
        ? `rgba(${primaryRgb}, 0.1)`
        : `rgba(${primaryRgb}, 0.06)`
    const accentBorder = isDark
        ? `rgba(${primaryRgb}, 0.22)`
        : `rgba(${primaryRgb}, 0.14)`

    return {
        primary: palette.primary,
        secondary: palette.secondary,
        accent: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
        onAccent: getLuminance(palette.primary) > 0.62 ? '#18181b' : '#ffffff',
        bg: neutral.bg,
        surface: neutral.surface,
        surfaceRaised: neutral.surfaceRaised,
        text: neutral.text,
        textSecondary: neutral.textSecondary,
        textMuted: neutral.textMuted,
        border: neutral.border,
        borderSubtle: neutral.borderSubtle,
        accentSoft,
        accentBorder,
        shadowSm: neutral.shadowSm,
    }
}

export function getCssVars(colors) {
    return {
        '--pf-primary-rgb': hexToRgb(colors.primary),
        '--pf-primary': colors.primary,
        '--pf-secondary': colors.secondary,
        '--pf-accent': colors.accent,
        '--pf-on-accent': colors.onAccent,
        '--pf-bg': colors.bg,
        '--pf-surface': colors.surface,
        '--pf-surface-raised': colors.surfaceRaised,
        '--pf-text': colors.text,
        '--pf-text-secondary': colors.textSecondary,
        '--pf-text-muted': colors.textMuted,
        '--pf-border': colors.border,
        '--pf-border-subtle': colors.borderSubtle,
        '--pf-accent-soft': colors.accentSoft,
        '--pf-accent-border': colors.accentBorder,
        '--pf-shadow-sm': colors.shadowSm,
    }
}