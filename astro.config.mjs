import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

export default defineConfig({
  server: {
    host: true,
    allowedHosts: [
      'objectives-weapon-recruiting-admission.trycloudflare.com'
    ]
  },

  integrations: [react(), mdx()],
  adapter: vercel()
});