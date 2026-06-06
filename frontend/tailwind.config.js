/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4f8',
                    100: '#dde6ef',
                    200: '#bbc9dc',
                    300: '#8fa6c4',
                    400: '#6b8aab',
                    500: '#5a7a9e',
                    600: '#4a6585',
                    700: '#3d536d',
                    800: '#33445a',
                    900: '#2b3849',
                },
                accent: {
                    50: '#f4f7fa',
                    100: '#e8eef4',
                    200: '#d1dce8',
                    300: '#b0c4d6',
                    400: '#8fa4bc',
                    500: '#7a96b5',
                    600: '#6582a0',
                    700: '#526b85',
                    800: '#44566c',
                    900: '#3a4859',
                },
                dark: {
                    50: '#fafaf9',
                    100: '#f4f4f5',
                    200: '#e4e4e7',
                    300: '#d4d4d8',
                    400: '#a1a1aa',
                    500: '#71717a',
                    600: '#52525b',
                    700: '#3f3f46',
                    800: '#27272a',
                    900: '#18181b',
                    950: '#09090b',
                },
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    hover: 'var(--color-surface-hover)',
                },
                border: {
                    DEFAULT: 'var(--color-border)',
                    hover: 'var(--color-border-hover)',
                },
                background: 'var(--color-bg-primary)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(90, 122, 158, 0.2)' },
                    '100%': { boxShadow: '0 0 40px rgba(122, 150, 181, 0.28)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'mesh-gradient': 'linear-gradient(135deg, #5a7a9e 0%, #7a96b5 100%)',
            },
            borderRadius: {
                DEFAULT: '10px',
            },
        },
    },
    plugins: [],
}