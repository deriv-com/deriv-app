// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: ['./src/**/*.{ts,tsx}'],
//     presets: [require('@deriv/quill-design/quill-tailwind/tailwind.config.cjs')],
//     theme: {
//         extend: {
//             // your theme stuff
//         },
//     },
// };

import type { Config } from 'tailwindcss';
import QuillTailwindConfig from '@deriv/quill-design/quill-tailwind/tailwind.config.cjs';

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [QuillTailwindConfig],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
