import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync } from 'node:fs';

/** Copy CSS files that aren't imported by any JS entry point. */
function copyCss(): Plugin {
  return {
    name: 'copy-css',
    closeBundle() {
      const src = resolve(__dirname, 'src/components/NoFrameworkOverflow/noframework.css');
      const dest = resolve(__dirname, 'dist/components/NoFrameworkOverflow/noframework.css');
      mkdirSync(resolve(__dirname, 'dist/components/NoFrameworkOverflow'), { recursive: true });
      copyFileSync(src, dest);
    },
  };
}

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' }), copyCss()],
  build: {
    lib: {
      formats: ['es'],
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        overflow: resolve(__dirname, 'src/components/Overflow/index.ts'),
        rx: resolve(__dirname, 'src/components/RxOverflow/index.ts'),
        mui: resolve(__dirname, 'src/components/MuiOverflow/index.ts'),
        vanilla: resolve(__dirname, 'src/components/NoFrameworkOverflow/index.ts'),
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@mui/material',
        '@mui/material/styles',
        '@mui/material/Menu',
        '@mui/material/MenuItem',
        '@mui/icons-material',
        /^@mui\//,
        /^@emotion\//,
        '@radix-ui/react-popover',
        /^@radix-ui\//,
        'clsx',
        'tailwind-merge',
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
  },
});
