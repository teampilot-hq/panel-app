import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    define: {
        'process.env': {},
    },
    resolve: {
        alias: {
            '~': "/src",
            '@': '/src',
        },
    },
    root: '.',
    build: {
        outDir: 'dist'
    },
    server: {
        proxy: {
            // Proxy all requests starting with '/api'
            '/api': {
                target: 'https://api.teampilot.app',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})