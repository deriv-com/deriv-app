import { Localize } from '@deriv-com/translations';

export const MAX_ALLOWED_REASONS_FOR_CLOSING_ACCOUNT = 3;
export const CHARACTER_LIMIT_FOR_CLOSING_ACCOUNT = 110;
export const SET_CHECKBOX_DISABLED = 'SET_CHECKBOX_DISABLED';
export const SET_TOTAL_CHECKBOX_CHECKED = 'SET_TOTAL_CHECKBOX_CHECKED';
export const SET_REMAINING_CHARACTERS = 'SET_REMAINING_CHARACTERS';
export const SET_TOTAL_ACCUMULATED_CHARACTERS = 'SET_TOTAL_ACCUMULATED_CHARACTERS';

export const getCloseAccountReasonsList = () => [
    {
        name: 'financial-priorities',
        label: <Localize i18n_default_text='I have other financial priorities.' />,
    },
    {
        name: 'stop-trading',
        label: <Localize i18n_default_text='I want to stop myself from trading.' />,
    },
    {
        name: 'not-interested',
        label: <Localize i18n_default_text='I’m no longer interested in trading.' />,
    },
    {
        name: 'another-website',
        label: <Localize i18n_default_text='I prefer another trading website.' />,
    },
    {
        name: 'not-user-friendly',
        label: <Localize i18n_default_text='The platforms aren’t user-friendly.' />,
    },
    {
        name: 'difficult-transactions',
        label: <Localize i18n_default_text='Making deposits and withdrawals is difficult.' />,
    },
    {
        name: 'lack-of-features',
        label: <Localize i18n_default_text='The platforms lack key features or functionality.' />,
    },
    {
        name: 'unsatisfactory-service',
        label: <Localize i18n_default_text='Customer service was unsatisfactory.' />,
    },
    {
        name: 'other-reasons',
        label: <Localize i18n_default_text='I’m closing my account for other reasons.' />,
    },
];
