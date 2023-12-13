/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                brand: {
                    coral: '#ff444f',
                    blue: '#85acb0',
                    orange: '#ff6444',
                    night: '#2a3052',
                },
                system: {
                    light: {
                        'prominent-text': '#333333',
                        'general-text': '#333333',
                        'less-prominent-text': '#999999',
                        'disabled-text': '#d6d6d6',
                        'active-background': '#d6dadb',
                        'hover-background': '#e6e9e9',
                        'secondary-background': '#f2f3f4',
                        'primary-background': '#ffffff',
                    },
                    dark: {
                        'prominent-text': '#ffffff',
                        'general-text': '#c2c2c2',
                        'less prominent-text': '#6e6e6e',
                        'disabled-text': '#3e3e3e',
                        'active-background': '#323738',
                        'hover-background': '#242828',
                        'secondary-background': '#151717',
                        'primary-background': '#0e0e0e',
                    },
                },
                status: {
                    light: {
                        success: '#4bb4b3',
                        danger: '#ec3f3f',
                        warning: '#ffad3a',
                        information: '#377cfc',
                    },
                    dark: {
                        success: '#00a79e',
                        danger: '#cc2e3d',
                        warning: '#ffad3a',
                        information: '#377cfc',
                        general: '#ffffff',
                    },
                },
                button: {
                    primary: {
                        default: '#ff444f',
                        hover: {
                            light: '#eb3e48',
                            dark: '#ff525c',
                        },
                    },
                    'primary-light': {
                        default: '#ff444f29',
                        hover: '#ff444f3d',
                    },
                },
                random: {
                    orange: '#ff8c00',
                    green: '#71bd0e',
                    teal: '#00a8af',
                    blue: '#3f6fe5',
                    purple: '#db69e1',
                },
            },
        },
    },
    presets: [require('@deriv/quill-design/quill-tailwind/tailwind.config.cjs')],
};
