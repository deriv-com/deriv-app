import { Localize } from '@deriv-com/translations';

export const API_TOKEN_CARD_DETAILS = [
    {
        name: 'read',
        display_name: <Localize i18n_default_text='Read' />,
        description: (
            <Localize i18n_default_text='This scope will allow third-party apps to view your account activity, settings, limits, balance sheets, trade purchase history, and more.' />
        ),
    },
    {
        name: 'trade',
        display_name: <Localize i18n_default_text='Trade' />,
        description: (
            <Localize i18n_default_text='This scope will allow third-party apps to buy and sell contracts for you, renew your expired purchases, and top up your demo accounts.' />
        ),
    },
    {
        name: 'payments',
        display_name: <Localize i18n_default_text='Payments' />,
        description: (
            <Localize i18n_default_text='This scope will allow third-party apps to withdraw to payment agents and make inter-account transfers for you.' />
        ),
    },
    {
        name: 'trading_information',
        display_name: <Localize i18n_default_text='Trading information' />,
        description: (
            <Localize i18n_default_text='This scope will allow third-party apps to view your trading history.' />
        ),
    },
    {
        name: 'admin',
        display_name: <Localize i18n_default_text='Admin' />,
        description: (
            <Localize i18n_default_text='This scope will allow third-party apps to open accounts for you, manage your settings and token usage, and more. ' />
        ),
    },
];

export const TOKEN_LIMITS = {
    MIN: 2,
    MAX: 32,
} as const;

export const TOKEN_NAME_REGEX = /^[A-Za-z0-9\s_]+$/;
