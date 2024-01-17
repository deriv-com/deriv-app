import type { Config } from 'tailwindcss';
import QuillTailwindConfig from '@deriv/quill-design/quill-tailwind/tailwind.config.cjs';

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    corePlugins: {
        preflight: false,
    },
    presets: [QuillTailwindConfig],
} satisfies Config;
