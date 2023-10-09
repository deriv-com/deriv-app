import React from 'react';
import { Localize } from '@deriv/translations';
import { CFD_PLATFORMS } from '@deriv/shared';

type WalletSuccessContent = {
    title: JSX.Element;
    description: JSX.Element;
    text_submit: JSX.Element;
    text_cancel: JSX.Element;
};

type WalletSuccessContentMapperType = (
    is_demo: boolean,
    account_title: string,
    mt5_jurisdiction?: string,
    platform?: string,
    currency?: string
) => WalletSuccessContent;

const WalletSuccessContentMapper: WalletSuccessContentMapperType = (
    is_demo,
    account_title,
    mt5_jurisdiction,
    platform,
    currency
) => {
    let title: JSX.Element, description: JSX.Element, text_submit: JSX.Element, text_cancel: JSX.Element;
    const TextCancel = <Localize i18n_default_text='Maybe Later' />;

    if (platform === CFD_PLATFORMS.DXTRADE) {
        if (is_demo) {
            title = (
                <Localize i18n_default_text='Your {{account_title}} Demo account is ready' values={{ account_title }} />
            );
            description = (
                <Localize
                    i18n_default_text='Transfer virtual funds from your Demo Wallet to your {{account_title}} demo account to practise trading.'
                    values={{ account_title }}
                />
            );
            text_submit = <Localize i18n_default_text='Transfer funds' />;
            text_cancel = TextCancel;
        } else {
            title = <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />;
            description = (
                <Localize
                    i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{account_title}} account to start trading.'
                    values={{ account_title, currency }}
                />
            );
            text_submit = <Localize i18n_default_text='Transfer funds' />;
            text_cancel = TextCancel;
        }

        return { title, description, text_submit, text_cancel };
    }

    if (is_demo) {
        title = (
            <Localize i18n_default_text='Your {{account_title}} demo account is ready' values={{ account_title }} />
        );
        description = (
            <Localize
                i18n_default_text='You can now start practicing trading with your {{account_title}} demo account.'
                values={{ account_title }}
            />
        );
        text_submit = <Localize i18n_default_text='Continue' />;
        text_cancel = TextCancel;
    } else {
        title = <Localize i18n_default_text='Almost there' />;
        description = (
            <Localize
                i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{mt5_jurisdiction}} account. You’ll get an in-app notification as soon as this is done.'
                values={{ mt5_jurisdiction }}
            />
        );
        text_submit = <Localize i18n_default_text='Transfer funds' />;
        text_cancel = TextCancel;
    }

    return { title, description, text_submit, text_cancel };
};

export const getWalletSuccessText: WalletSuccessContentMapperType = (
    is_demo,
    account_title,
    mt5_jurisdiction,
    platform = CFD_PLATFORMS.MT5,
    currency = 'USD'
) => {
    return WalletSuccessContentMapper(is_demo, account_title, mt5_jurisdiction, platform, currency);
};
