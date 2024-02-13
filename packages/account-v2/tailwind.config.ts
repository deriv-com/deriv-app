import type { Config } from 'tailwindcss';
import QuillTailwindConfig from '@deriv/quill-design/quill-tailwind/tailwind.config.cjs';

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [QuillTailwindConfig],
    theme: {
        extend: {
            colors: {
                solid: {
                    grey: {
                        '1': '#999999',
                        '2': '#f2f3f4',
                        '5': '#d6dadb',
                        '6': '#d6d6d6',
                    },
                    black: {
                        '0': '#0e0e0e',
                        '3': '#151717',
                        '8': '#323738',
                    },
                    red: {
                        '5': '#eb3e48',
                    },
                },
            },
        },
    },
} satisfies Config;
