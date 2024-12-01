import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].${Date.now()}.js`,
                chunkFileNames: `assets/[name].${Date.now()}.js`,
                assetFileNames: `assets/[name].${Date.now()}.[ext]`,
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
                }
            }
        }
    },
    server: {
        force: true,
        hmr: {
            overlay: true
        }
    }
});
