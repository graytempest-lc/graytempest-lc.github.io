import {defineConfig} from 'astro/config';
export default defineConfig({
  site: 'https://graytempest-lc.github.io',
  output: 'static',
  trailingSlash: 'never',
  build: {format: 'file'},
  compressHTML: false
});
