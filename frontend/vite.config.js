import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiTarget = (env.VITE_API_URL || 'http://localhost:5001').replace(/\/api\/?$/, '')

    return {
        plugins: [react()],
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
