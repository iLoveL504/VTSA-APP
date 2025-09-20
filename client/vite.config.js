import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
 // const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // server: {
    //   port: 5173,
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_API_BASE_URL || 'http://localhost:4000',
    //       changeOrigin: true,
    //     },
    //   },
    // },
    // build: {
    //   outDir: 'dist',
    //   sourcemap: mode !== 'production',
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         vendor: ['react', 'react-dom'],
    //         mui: ['@mui/material'],
    //         charts: ['gantt-task-react', 'wx-react-gantt'],
    //       },
    //     },
    //   },
    //   chunkSizeWarningLimit: 1000,
    // },
    // resolve: {
    //   alias: {
    //     '@': resolve(__dirname, 'src'),
    //   },
    // },
    // define: {
    //   'process.env': {},
    // },
  };
});