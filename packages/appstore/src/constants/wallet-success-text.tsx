import React from 'react';
import { Localize } from '@deriv/translations';

type TWalletSuccessContent = {
    title: JSX.Element;
    description: JSX.Element;
    text_submit: JSX.Element;
    text_cancel?: JSX.Element;
};

type TWalletSuccessContentMapperType = {
    'add-wallet': (currency: string) => TWalletSuccessContent;
    'add-trading': (account_title: string, currency_title: string) => TWalletSuccessContent;
    'add-mt5': (is_demo: boolean, account_title: string, mt5_jurisdiction: string) => TWalletSuccessContent;
};

const WalletSuccessContentMapper: TWalletSuccessContentMapperType = {
    'add-wallet': currency => ({
        title: <Localize i18n_default_text='Your {{currency}} Wallet is ready' values={{ currency }} />,
        description: <Localize i18n_default_text='Make a deposit into your new Wallet.' />,
        text_submit: <Localize i18n_default_text='Deposit' />,
        text_cancel: <Localize i18n_default_text='Maybe later' />,
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
        text_cancel: <Localize i18n_default_text='Maybe later' />,
    }),
    'add-mt5': (is_demo, account_title, mt5_jurisdiction) => {
        let title: JSX.Element,
            description: JSX.Element,
            text_submit: JSX.Element,
            text_cancel: JSX.Element | undefined;

        if (is_demo) {
            title = <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />;
            description = (
                <Localize
                    i18n_default_text='You can now start practicing trading with your {{account_title}}.'
                    values={{ account_title }}
                />
            );
            text_submit = <Localize i18n_default_text='Continue' />;
        } else {
            title = <Localize i18n_default_text='Almost there' />;
            description = (
                <Localize
                    i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{mt5_jurisdiction}} account. You’ll get an in-app notification as soon as this is done.'
                    values={{ mt5_jurisdiction }}
                />
            );
            text_submit = <Localize i18n_default_text='Transfer funds' />;
            text_cancel = <Localize i18n_default_text='Maybe later' />;
        }

        return { title, description, text_submit, text_cancel };
    },
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
