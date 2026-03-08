import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      plugins: [react()],
      
      base: '/',  // Use './' if deploying to /repo-name/ subfolder
      
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), './src'),  // Changed from '.' to './src'
        },
      },
      
      // Optional: Output directory name
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'esbuild',
      },
      
      server: {
        port: 5173,  // Standard Vite port
        host: '0.0.0.0',
      },
      
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      },
    };
});
