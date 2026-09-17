import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function voyagesMetaPlugin() {
  return {
    name: 'voyages-meta-plugin',
    transform(code: string, id: string) {
      const cleanPath = id.split('?')[0];
      if (cleanPath.includes('/content/voyages/') && cleanPath.endsWith('.json')) {
        try {
          const stats = fs.statSync(cleanPath);
          const data = JSON.parse(code);
          data._mtime = stats.mtimeMs;
          data._fileDate = stats.mtime.toISOString();
          return {
            code: `export default ${JSON.stringify(data)};`,
            map: null,
          };
        } catch (e) {
          return null;
        }
      }
      return null;
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [voyagesMetaPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
