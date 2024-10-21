import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import astroExpressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'The Mythic Age',
    social: {
      github: 'https://github.com/kbrakke/the-mythic-age'
    },
    sidebar: [{
      label: 'Campaigns',
      autogenerate: {
        directory: 'campaigns'
      }
    }, {
      label: 'Character Options',
      autogenerate: {
        directory: 'resources'
      }
    }, {
      label: 'Weapons',
      collapsed: true,
      autogenerate: {
        directory: 'weapons'
      }
    }, {
      label: 'World',
      autogenerate: {
        directory: 'world'
      }
    }]
  }), react(), tailwind(),astroExpressiveCode(), mdx()]
});