import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Enable Preact to support Preact JSX components.
		preact(),
		// Enable React for the Algolia search component.
		react(),
	],
	site: `https://kbrakke.github.io/the-mythic-age/`,
	// GitLab Pages requires exposed files to be located in a folder called "public".
  // So we're instructing Astro to put the static build output in a folder of that name.
  dist: 'public',

  // The folder name Astro uses for static files (`public`) is already reserved 
  // for the build output. So in deviation from the defaults we're using a folder
  // called `static` instead.
  public: 'static',
});
