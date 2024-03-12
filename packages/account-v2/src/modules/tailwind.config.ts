import type { Config } from 'tailwindcss';

export default {
    presets: [require('../../tailwind.config.ts')],
    content: ['../src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    purge: ['./src/**/*.{js,jsx,ts,tsx}'],
    plugins: [],
} satisfies Config;
