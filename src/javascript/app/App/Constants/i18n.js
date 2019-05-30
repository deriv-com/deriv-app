import * as messages from '../../../../translations/messages.json';

export const i18n_config = {
    resources: {
        EN: {
            translation: {
                ...messages,
            },
        },
    },
    lng: window.location.search ?
        window.location.search
            .substr(1).split('&')
            .find(query => query.includes('lang='))
            .split('=')[1]
            .toUpperCase()
        : undefined,
    fallbackLng: 'en',
};
