/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    important: '.account-v2',
    presets: [require('@deriv/quill-design/quill-tailwind/tailwind.config.cjs')],
    corePlugins: {
        preflight: false,
    },
};
