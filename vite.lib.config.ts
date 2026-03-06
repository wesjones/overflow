import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, relative, dirname } from 'node:path';

/**
 * Vite strips CSS imports from JS in library mode, replacing them with
 * empty-css comments. This plugin restores them as real
 * `import './path.css';` statements so consumers' bundlers pick up the CSS.
 */
function restoreCssImports(): Plugin {
  return {
    name: 'restore-css-imports',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssFiles = new Set(
        Object.keys(bundle).filter(f => f.endsWith('.css'))
      );

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk') continue;

        // Match Vite's empty-css comment pattern and extract the original path hint
        const code = chunk.code.replace(/\/\*\s*empty css\s[^*]*\*\/\n?/g, '');
        const imports: string[] = [];

        // Use Vite's internal module info to find CSS dependencies
        if (chunk.viteMetadata) {
          const meta = chunk.viteMetadata as { importedCss?: Set<string> };
          if (meta.importedCss) {
            for (const cssPath of meta.importedCss) {
              if (cssFiles.has(cssPath)) {
                const rel = relative(dirname(fileName), cssPath);
                const importPath = rel.startsWith('.') ? rel : `./${rel}`;
                imports.push(`import '${importPath}';`);
              }
            }
          }
        }

        if (imports.length > 0) {
          chunk.code = imports.join('\n') + '\n' + code;
        } else {
          chunk.code = code;
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' }), restoreCssImports()],
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
