import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'The Mythic Age',
    social: {
      github: 'https://github.com/kbrakke/the-mythic-age'
    },
    sidebar: [{
      label: 'Character Options',
      autogenerate: {
        directory: 'resources'
      }
    }, {
      label: 'Weapons',
      autogenerate: {
        directory: 'weapons'
      }
    }, {
      label: 'World',
      autogenerate: {
        directory: 'world'
      }
    }]
  }), react()]
});