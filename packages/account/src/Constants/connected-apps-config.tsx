import { Localize } from '@deriv-com/translations';

export const CONNECTED_APPS_INFO_BULLETS = [
    {
        key: 1,
        text: (
            <Localize i18n_default_text='Connected apps are authorised applications associated with your account through your API token or the OAuth authorisation process. They can act on your behalf within the limitations that you have set.' />
        ),
    },
    {
        key: 2,
        text: (
            <Localize i18n_default_text='As a user, you are responsible for sharing access and for actions that occur in your account (even if they were initiated by a third-party app on your behalf).' />
        ),
    },
    {
        key: 3,
        text: (
            <Localize i18n_default_text='Please note that only third-party apps will be displayed on this page. Official Deriv apps will not appear here.' />
        ),
    },
];
