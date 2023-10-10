import React from 'react';
import { Localize } from '@deriv/translations';

type TWalletSuccessContent = {
    [key: string]: JSX.Element;
};

type TWalletSuccessContentMapperType = {
    'add-wallet': (currency: string) => TWalletSuccessContent;
    'add-trading': (account_title: string, currency_title: string) => TWalletSuccessContent;
};

const WalletSuccessContentMapper: TWalletSuccessContentMapperType = {
    'add-wallet': currency => ({
        title: <Localize i18n_default_text='Your {{currency}} Wallet is ready' values={{ currency }} />,
        description: <Localize i18n_default_text='Make a deposit into your new Wallet.' />,
        text_submit: <Localize i18n_default_text='Deposit' />,
        text_cancel: <Localize i18n_default_text='Maybe Later' />,
    }),
    'add-trading': (account_title, currency_title) => ({
        title: <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />,
        description: (
            <Localize
                i18n_default_text='Transfer funds from your {{currency_title}} to your {{account_title}} account to start trading.'
                values={{ account_title, currency_title }}
            />
        ),
        text_submit: <Localize i18n_default_text='Transfer funds' />,
        text_cancel: <Localize i18n_default_text='Maybe Later' />,
    }),
};

export const getWalletSuccessText = (
    type: keyof TWalletSuccessContentMapperType,
    ...args: Parameters<TWalletSuccessContentMapperType[keyof TWalletSuccessContentMapperType]>
): TWalletSuccessContent | undefined => {
    if (WalletSuccessContentMapper[type]) {
        return WalletSuccessContentMapper[type](...args);
    }
    return undefined;
};
