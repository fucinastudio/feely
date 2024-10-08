import sharedConfig from '@fucina/tailwind/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'presets'> = {
  presets: [
    {
      ...sharedConfig,
      content: [
        './app/**/*.tsx',
        './components/**/*.tsx',
        './utils/**/*.ts',
        './node_modules/@fucina/ui/dist/**/*.mjs',
        './node_modules/@fucina/visualizations/dist/**/*.mjs',
        './node_modules/@fucina/utils/dist/**/*.mjs',
      ],
      theme: {
        extend: {
          ...sharedConfig?.theme?.extend,
          fontFamily: {
            inter: ['var(--font-inter)'],
            geist: ['var(--font-geist-sans)'],
          },
        },
      },
    },
  ],
};

export default config;
