/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    important: '.quill-design',
    presets: [require('@deriv/quill-design/quill-tailwind/tailwind.config.cjs')],
    corePlugins: {
        preflight: false,
    },
};
