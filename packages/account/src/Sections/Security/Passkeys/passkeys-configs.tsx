import React from 'react';
import { Localize } from '@deriv/translations';

export const PASSKEY_STATUS_CODES = {
    NONE: '',
    REGISTERED: 'registered',
    RENAMING: 'renaming',
    REVOKED: 'revoked',
    REVOKE_VERIFY: 'revoke_verify',
} as const;

export type TPasskeysStatus = typeof PASSKEY_STATUS_CODES[keyof typeof PASSKEY_STATUS_CODES];

export const getPasskeysTips = () =>
    [
        {
            id: 1,
            description: <Localize i18n_default_text='Enable screen lock on your device.' />,
        },
        {
            id: 2,
            description: <Localize i18n_default_text='Sign in to your Google or iCloud account.' />,
        },
        {
            id: 3,
            description: <Localize i18n_default_text='Enable Bluetooth.' />,
        },
    ] as const;

export const getPasskeysDescriptions = () =>
    [
        {
            id: 1,
            question: <Localize i18n_default_text='What are Passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are a security measure that lets you log in the same way you unlock your device: with a fingerprint, a face scan, or a screen lock PIN. ' />
            ),
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Why passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are an added layer of security that protects your account against unauthorised access and phishing attacks.' />
            ),
        },
        {
            id: 3,
            question: <Localize i18n_default_text='How to create a passkey?' />,
            description: (
                <Localize i18n_default_text="Go to 'Account Settings' on Deriv GO to set up your passkey. Each device can only save one passkey; however, iOS users may still see the 'Create passkey' button due to iOS’s ability to save passkeys on other devices." />
            ),
        },
        {
            id: 4,
            question: <Localize i18n_default_text='Where are Passkeys saved?' />,
            description: (
                <Localize i18n_default_text='Passkeys are saved in your password manager to help you sign in on other devices.' />
            ),
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What if I change my Deriv account email?' />,
            description: (
                <Localize i18n_default_text='Even if you change your email address, you can still continue to log in to Deriv.com with the same passkey.' />
            ),
        },
    ] as const;

export const getStatusContent = (status: Exclude<TPasskeysStatus, ''>) => {
    const titles: Record<Exclude<TPasskeysStatus, ''>, React.ReactElement> = {
        registered: <Localize i18n_default_text='Passkey registered successfully!' />,
        renaming: <Localize i18n_default_text='Rename passkey' />,
        revoked: <Localize i18n_default_text='Passkey revoked successfully!' />,
        revoke_verify: <Localize i18n_default_text='Please help us verify your revoke  passkey request.' />,
    };

    const icons: Record<Exclude<TPasskeysStatus, ''>, string> = {
        registered: 'IcSuccessPasskey',
        renaming: 'IcRenamePasskey',
        revoked: 'IcSuccessPasskey',
        revoke_verify: 'IcRevokePasskey',
    };

    const descriptions: Record<Exclude<TPasskeysStatus, ''>, React.ReactElement> = {
        registered: (
            <Localize i18n_default_text='Your account is now set up with a passkey,allowing you to easily log in and manage it in your account settings.' />
        ),
        renaming: <Localize i18n_default_text='Update your passkey name for customization.' />,
        revoked: (
            <Localize i18n_default_text='Your passkey is successfully revoked. To avoid sign-in prompts, remove them from your google password manager.' />
        ),
        revoke_verify: (
            <Localize i18n_default_text='Hit the button below and we’ll send you an email with a link. Tap that link to verify your revoke request. This is to protect your account from unauthorised passkeys.' />
        ),
    };

    const button_texts: Record<Exclude<TPasskeysStatus, ''>, React.ReactElement> = {
        registered: <Localize i18n_default_text='Continue' />,
        renaming: <Localize i18n_default_text=' ' />,
        revoked: <Localize i18n_default_text=' ' />,
        revoke_verify: <Localize i18n_default_text=' ' />,
    };

    return {
        title: titles[status],
        description: descriptions[status],
        icon: icons[status],
        button_text: button_texts[status],
    };
};
