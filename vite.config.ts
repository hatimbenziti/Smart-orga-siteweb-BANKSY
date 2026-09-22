import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

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
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
