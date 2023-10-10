import React from 'react';
import { Localize } from '@deriv/translations';
import { CFD_PLATFORMS, Jurisdiction } from '@deriv/shared';

type WalletSuccessContent = {
    title: JSX.Element;
    description: JSX.Element;
    text_submit: JSX.Element;
    text_cancel?: JSX.Element;
};

type WalletSuccessContentMapperType = (
    is_demo: boolean,
    account_title: string,
    description_title: string,
    type: 'all' | 'financial' | 'synthetic',
    is_verified: boolean,
    manual_status: string,
    mt5_jurisdiction?: string,
    platform?: string,
    currency?: string
) => WalletSuccessContent;

const WalletSuccessContentMapper: WalletSuccessContentMapperType = (
    is_demo,
    account_title,
    description_title,
    type,
    is_verified,
    manual_status,
    mt5_jurisdiction,
    platform,
    currency
): WalletSuccessContent => {
    let title: JSX.Element = <></>;
    let description: JSX.Element = <></>;
    let text_submit: JSX.Element = <></>;
    let text_cancel: JSX.Element | undefined;

    const all_documents_are_ready = is_verified;
    const need_few_minutes =
        [Jurisdiction.BVI, Jurisdiction.VANUATU].includes(mt5_jurisdiction) && manual_status !== 'pending';
    const need_some_days =
        [Jurisdiction.LABUAN, Jurisdiction.MALTA_INVEST].includes(mt5_jurisdiction) ||
        ([Jurisdiction.BVI, Jurisdiction.VANUATU].includes(mt5_jurisdiction) && manual_status === 'pending');

    // for DXTrade
    if (platform === CFD_PLATFORMS.DXTRADE) {
        // for demo
        if (is_demo) {
            title = (
                <Localize i18n_default_text='Your {{account_title}} demo account is ready' values={{ account_title }} />
            );
            description = (
                <Localize
                    i18n_default_text='Transfer virtual funds from your Demo Wallet to your {{description_title}} Demo account to practise trading.'
                    values={{ description_title }}
                />
            );
            text_submit = <Localize i18n_default_text='Transfer funds' />;
            text_cancel = <Localize i18n_default_text='Maybe Later' />;
        }
        // for real
        else {
            title = <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />;
            description = (
                <Localize
                    i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                    values={{ description_title, currency }}
                />
            );
            text_submit = <Localize i18n_default_text='Transfer funds' />;
            text_cancel = <Localize i18n_default_text='Maybe Later' />;
        }
    }

    // for MT5
    if (platform === CFD_PLATFORMS.MT5) {
        // Derived
        if (type === 'synthetic') {
            // SVG
            if (mt5_jurisdiction === Jurisdiction.SVG) {
                if (is_demo) {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} demo account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='You can now start practicing trading with your {{description_title}} demo account.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Continue' />;
                } else {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} demo account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                            values={{ currency, description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
                }
            }
            // BVI and VANUATU
            if (mt5_jurisdiction === Jurisdiction.BVI || mt5_jurisdiction === Jurisdiction.VANUATU) {
                if (all_documents_are_ready) {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                            values={{ currency, description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
                }
                // need 1-3 days
                else if (need_some_days) {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need 1-3 days to review your documents before you can start trading with your {{description_title}} account. You’ll get an email as soon as this is done.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='OK' />;
                }
                // need a few minutes
                else if (need_few_minutes) {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{description_title}} account. You’ll get an in-app notification as soon as this is done.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='OK' />;
                }
            }
        }

        // Financial
        if (type === 'financial') {
            // SVG
            if (mt5_jurisdiction === Jurisdiction.SVG) {
                if (is_demo) {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} demo account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='You can now start practicing trading with your {{description_title}} demo account.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Continue' />;
                } else {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} demo account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                            values={{ currency, description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
                }
            }
            // BVI, VANUATU and LABUAN
            if (
                mt5_jurisdiction === Jurisdiction.BVI ||
                mt5_jurisdiction === Jurisdiction.VANUATU ||
                mt5_jurisdiction === Jurisdiction.LABUAN
            ) {
                if (all_documents_are_ready) {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                            values={{ currency, description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
                }
                // need 1-3 days
                else if (need_some_days) {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need 1-3 days to review your documents before you can start trading with your {{description_title}} account. You’ll get an email as soon as this is done.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='OK' />;
                }
                // need a few minutes
                else if (need_few_minutes) {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{description_title}} account. You’ll get an in-app notification as soon as this is done.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='OK' />;
                }
            }
            // MALTA_INVEST
            if (mt5_jurisdiction === Jurisdiction.MALTA_INVEST) {
                if (all_documents_are_ready) {
                    title = (
                        <Localize
                            i18n_default_text='Your {{account_title}} account is ready'
                            values={{ account_title }}
                        />
                    );
                    description = (
                        <Localize
                            i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                            values={{ currency, description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
                }
                // need 1-3 days
                else if (need_some_days) {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need 1-3 days to review your documents before you can start trading with your {{description_title}} account. You’ll get an email as soon as this is done.'
                            values={{ description_title }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='OK' />;
                }
            }
        }

        // Swap-Free
        if (type === 'all') {
            if (is_demo) {
                title = (
                    <Localize
                        i18n_default_text='Your {{account_title}} demo account is ready'
                        values={{ account_title }}
                    />
                );
                description = (
                    <Localize
                        i18n_default_text='You can now start practicing trading with your {{description_title}} demo account.'
                        values={{ description_title }}
                    />
                );
                text_submit = <Localize i18n_default_text='Continue' />;
            } else {
                title = (
                    <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />
                );
                description = (
                    <Localize
                        i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{description_title}} account to start trading.'
                        values={{ currency, description_title }}
                    />
                );
                text_submit = <Localize i18n_default_text='Transfer funds' />;
                text_cancel = <Localize i18n_default_text='Maybe Later' />;
            }
        }
    }

    return { title, description, text_submit, text_cancel };
};

export const getWalletSuccessText: WalletSuccessContentMapperType = (
    is_demo,
    account_title,
    description_title,
    type,
    is_verified,
    manual_status,
    mt5_jurisdiction = Jurisdiction.SVG,
    platform = CFD_PLATFORMS.MT5,
    currency = 'USD'
) => {
    return WalletSuccessContentMapper(
        is_demo,
        account_title,
        description_title,
        type,
        is_verified,
        manual_status,
        mt5_jurisdiction,
        platform,
        currency
    );
};
