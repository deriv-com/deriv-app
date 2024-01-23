import type { Config } from 'tailwindcss';
import QuillTailwindConfig from '@deriv/quill-design/quill-tailwind/tailwind.config.cjs';
const plugin = require('tailwindcss/plugin');

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    plugins: [
        plugin(({ addUtilities }) => {
            addUtilities({
                '.outline': {
                    'outline-style': 'solid',
                },
                '.outline-1': {
                    'outline-width': '1px',
                },
                '.pl-800': {
                    'padding-left': '16px',
                },
            });
        }),
    ],
    presets: [QuillTailwindConfig],
    theme: {
        extend: {
            colors: {
                solid: {
                    grey: {
                        '1': '#999999',
                        '5': '#d6dadb',
                        '6': '#d6d6d6',
                    },
                },
            },
        },
    },
} satisfies Config;
