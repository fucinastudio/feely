import sharedConfig from '@fucina/tailwind/tailwind.config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'presets'> = {
  presets: [
    {
      ...sharedConfig,
      content: [
        './app/**/*.tsx',
        './components/**/*.tsx',
        './node_modules/@fucina/ui/dist/**/*.mjs',
        './node_modules/@fucina/visualizations/dist/**/*.mjs',
        './node_modules/@fucina/utils/dist/**/*.mjs',
      ],
      theme: {
        extend: {
          ...sharedConfig?.theme?.extend,
        },
      },
    },
  ],
};

export default config;
