import React from 'react';
import { Localize } from '@deriv/translations';

type WalletSuccessContent = {
    title: JSX.Element;
    description: JSX.Element;
    text_submit: JSX.Element;
};

type WalletSuccessContentMapperType = {
    'add-mt5': (is_demo: boolean, account_title: string, mt5_jurisdiction?: string) => WalletSuccessContent;
};

const WalletSuccessContentMapper: WalletSuccessContentMapperType = {
    'add-mt5': (is_demo, account_title, mt5_jurisdiction) => {
        let title: JSX.Element, description: JSX.Element, text_submit: JSX.Element;

        if (is_demo) {
            title = <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />;
            description = (
                <Localize
                    i18n_default_text='You can now start practicing trading with your {{account_title}} demo account.'
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
        }

        return { title, description, text_submit };
    },
};

export const getWalletSuccessText = (
    type: keyof WalletSuccessContentMapperType,
    ...args: Parameters<WalletSuccessContentMapperType[keyof WalletSuccessContentMapperType]>
): WalletSuccessContent | undefined => {
    if (WalletSuccessContentMapper[type]) {
        return WalletSuccessContentMapper[type](...args);
    }
    return undefined;
};
