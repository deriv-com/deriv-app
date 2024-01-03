/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('@deriv/quill-design/quill-tailwind/tailwind.config.cjs')],
    theme: {
        extend: {
            backfaceVisibility: {
                hidden: 'hidden',
            },
            button: {
                primary: {
                    default: '#ff444f',
                    hover: {
                        dark: '#ff525c',
                        light: '#eb3e48',
                    },
                },
                'primary-light': {
                    default: '#ff444f29',
                    hover: '#ff444f3d',
                },
            },
            colors: {
                brand: {
                    blue: '#85acb0',
                    brown: {
                        dark: '#664407',
                    },
                    coral: '#ff444f',
                    night: '#2a3052',
                    orange: '#ff6444',
                    red: {
                        dark: '#b33037',
                        darker: '#661b20',
                        light: '#ff444f',
                    },
                    voilet: {
                        dark: '#4a3871',
                    },
                    yellow: {
                        dark: '#b3760d',
                        light: '#ffa912',
                    },
                },
                random: {
                    blue: '#3f6fe5',
                    green: '#71bd0e',
                    orange: '#ff8c00',
                    purple: '#db69e1',
                    teal: '#00a8af',
                },
                status: {
                    dark: {
                        danger: '#cc2e3d',
                        general: '#ffffff',
                        information: '#377cfc',
                        success: '#00a79e',
                        warning: '#ffad3a',
                    },
                    light: {
                        danger: '#ec3f3f',
                        information: '#377cfc',
                        success: '#4bb4b3',
                        warning: '#ffad3a',
                    },
                },
                system: {
                    dark: {
                        'active-background': '#323738',
                        'disabled-text': '#3e3e3e',
                        'general-text': '#c2c2c2',
                        'hover-background': '#242828',
                        'less prominent-text': '#6e6e6e',
                        'primary-background': '#0e0e0e',
                        'prominent-text': '#ffffff',
                        'secondary-background': '#151717',
                    },
                    light: {
                        'active-background': '#d6dadb',
                        'disabled-text': '#d6d6d6',
                        'general-text': '#333333',
                        'hover-background': '#e6e9e9',
                        'less-prominent-text': '#999999',
                        'primary-background': '#ffffff',
                        'prominent-text': '#333333',
                        'secondary-background': '#f2f3f4',
                    },
                },
            },
            fontFamily: {
                sans: ['IBM Plex Sans', 'sans-serif'],
            },
        },
    },
};
