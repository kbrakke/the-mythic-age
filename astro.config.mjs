import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'The Mythic Age',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kbrakke/the-mythic-age' },
      ],
      customCss: ['./src/styles/global.css'],
      sidebar: [
        { label: 'Campaigns', items: [{ autogenerate: { directory: 'campaigns' } }] },
        { label: 'Character Options', items: [{ autogenerate: { directory: 'resources' } }] },
        { label: 'Weapons', collapsed: true, items: [{ autogenerate: { directory: 'weapons' } }] },
        { label: 'World', items: [{ autogenerate: { directory: 'world' } }] },
        { label: 'Misc', items: [{ autogenerate: { directory: 'misc' } }] },
      ],
    }),
    react(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
