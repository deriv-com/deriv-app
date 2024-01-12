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
            description: <Localize i18n_default_text='Has screen lock set up.' />,
        },
        {
            id: 2,
            description: <Localize i18n_default_text='Signed in to Google account for Android, and iCloud for iOS.' />,
        },
        {
            id: 3,
            description: <Localize i18n_default_text='Has bluetooth turned on if you want to use on another device.' />,
        },
    ] as const;

export const getPasskeysDescriptions = () =>
    [
        {
            id: 1,
            question: <Localize i18n_default_text='What are Passkeys?' />,
            description: (
                <Localize i18n_default_text='Passkeys are encrypted digital keys you create using your fingerprints, face or screen lock. ' />
            ),
        },
        {
            id: 2,
            question: <Localize i18n_default_text='Where are Passkeys saved?' />,
            description: (
                <Localize i18n_default_text='Passkey are saved to your password manager, so you can sign in on other devices.' />
            ),
        },
        {
            id: 3,
            question: <Localize i18n_default_text='Why do you need a Passkeys?' />,
            description: (
                <Localize i18n_default_text='A passkey is crucial for security, granting authorized access while keeping unauthorized users out, enhancing data protection.' />
            ),
        },
        {
            id: 4,
            question: <Localize i18n_default_text='How to create Passkeys?' />,
            description: (
                <Localize i18n_default_text='Simply go to "Account Settings" and follow the instructions in the "Passkeys" section. Note that Android allows only one passkey per device, while iOS users can save multiple passkeys for different devices.' />
            ),
        },
        {
            id: 5,
            question: <Localize i18n_default_text='What if I change my Deriv account email?' />,
            description: (
                <Localize i18n_default_text='If you update your Deriv account email, your passkey remains unaffected, and you can continue using it to log in.' />
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
