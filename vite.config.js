import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Manual chunking configuration
        manualChunks: (id) => {
          // Put highlight.js in its own chunk
          if (id.includes('highlight.js')) {
            return 'vendor-highlight';
          }
          // Put marked in its own chunk
          if (id.includes('marked')) {
            return 'vendor-marked';
          }
          // Other dependencies in a vendors chunk
          if (id.includes('node_modules')) {
            return 'vendors';
          }
        }
      }
    },
    // Increase the warning limit if still needed after chunking
    chunkSizeWarningLimit: 600
  }
}); 