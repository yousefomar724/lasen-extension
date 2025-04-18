import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react() ,tailwindcss(),],
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                background: path.resolve(__dirname, 'src/background/index.ts'),
                content: path.resolve(__dirname, 'src/content/index.ts'),
            },
            output: {
                entryFileNames: function (chunk) {
                    return chunk.name === 'main'
                        ? 'assets/[name]-[hash].js'
                        : 'src/[name].js';
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
