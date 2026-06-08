import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { LANDING_STATIC_HTML } from './scripts/landing-static-html.mjs'

function seoStaticHtmlPlugin() {
    return {
        name: 'seo-static-html',
        transformIndexHtml(html) {
            return html.replace(
                '<div id="root"></div>',
                `<div id="root">${LANDING_STATIC_HTML}</div>`,
            )
        },
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiTarget = (env.VITE_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '')

    return {
        plugins: [react(), seoStaticHtmlPlugin()],
        server: {
            port: 5173,
            host: true,
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: 'dist',
            sourcemap: false
        },
        test: {
            environment: 'jsdom',
            globals: true
        },
    }
})
