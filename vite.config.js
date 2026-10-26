import { defineConfig } from 'vite';

export default defineConfig({
  // Relative assets keep the static build portable across root and project subpaths.
  base: '/GSoC-AI-OSS/',
  build: {
    rolldownOptions: {
      output: {
        assetFileNames: ({ names }) =>
          names.includes('GSoC_appendix.pdf')
            ? 'assets/[name][extname]'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
