import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
// import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],

  preview: {
    host: 'localhost',
    port: 3333,
    strictPort: true,
  },
  server: {
    open: true,
    port: 3333,
    strictPort: true,
    // proxy: {
    //   "^/api": {
    //     target: process.env.VITE_BASE_URL,
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  // build: {
  //   outDir: './build',
  //   target: 'esnext',
  //   modulePreload: false,
  //   minify: false,
  //   cssCodeSplit: false
  // }
});
