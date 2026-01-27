// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://contextmirror.com',
  integrations: [
    starlight({
      title: 'Context Mirror',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/contextmirror' },
      ],
      customCss: ['./src/styles/global.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'docs/introduction' },
            { label: 'Installation', slug: 'docs/installation' },
            { label: 'Quick Start', slug: 'docs/quickstart' },
          ],
        },
        {
          label: 'Context Mirror',
          autogenerate: { directory: 'docs/context-mirror' },
        },
        {
          label: 'Voice Mirror',
          autogenerate: { directory: 'docs/voice-mirror' },
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'docs/reference' },
        },
      ],
      components: {
        Head: './src/components/Head.astro',
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
