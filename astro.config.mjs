// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Deployed to GitHub Pages as a project repo:
//   https://zerisinyu.github.io/personal-website/
// If you switch to a custom domain (or rename the repo to
// zerisinyu.github.io), set `site` accordingly and `base` to '/'.
export default defineConfig({
  site: 'https://zerisinyu.github.io',
  base: '/personal-website',
  integrations: [mdx()],
});
