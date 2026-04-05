import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendors': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-tabs'],
          'icons': ['react-icons', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
