import type { Config } from 'tailwindcss';

export default {
    presets: [require('../../tailwind.config.ts')],
    content: ['../src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
