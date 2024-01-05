import React from 'react';
import { Localize } from '@deriv/translations';

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
                <Localize i18n_default_text='Passkey are encrypted digital keys you create using your fingerprints, face or screen lock. ' />
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
                <Localize i18n_default_text='Simply go to "Account Settings" and follow the instructions in the "Passkey" section. Note that Android allows only one passkey per device, while iOS users can save multiple passkeys for different devices.' />
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
