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
    mt5_jurisdiction?: string,
    platform?: string,
    currency?: string
) => WalletSuccessContent;

const WalletSuccessContentMapper: WalletSuccessContentMapperType = (
    is_demo,
    account_title,
    description_title,
    type,
    mt5_jurisdiction,
    platform,
    currency
): WalletSuccessContent => {
    let title: JSX.Element = <></>;
    let description: JSX.Element = <></>;
    let text_submit: JSX.Element = <></>;
    let text_cancel: JSX.Element | undefined;

    // export const Jurisdiction = Object.freeze({
    //     SVG: 'svg',
    //     BVI: 'bvi',
    //     VANUATU: 'vanuatu',
    //     LABUAN: 'labuan',
    //     MALTA_INVEST: 'maltainvest',
    // });

    // const success_modal_data = {
    //     [CFD_PLATFORMS.DXTRADE]: {
    //         [Jurisdiction.SVG]: {
    //             demo: {
    //                 title: (
    //                     <Localize
    //                         i18n_default_text='Your {{account_title}} demo account is ready'
    //                         values={{ account_title }}
    //                     />
    //                 ),
    //                 description: (
    //                     <Localize
    //                         i18n_default_text='Transfer virtual funds from your demo Wallet to your {{account_title}} demo account to practise trading.'
    //                         values={{ account_title }}
    //                     />
    //                 ),
    //                 text_submit: <Localize i18n_default_text='Transfer funds' />,
    //                 text_cancel: <Localize i18n_default_text='Maybe Later' />,
    //             },
    //             real: {
    //                 title: (
    //                     <Localize
    //                         i18n_default_text='Your {{account_title}} account is ready'
    //                         values={{ account_title }}
    //                     />
    //                 ),
    //                 description: (
    //                     <Localize
    //                         i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{account_title}} account to start trading.'
    //                         values={{ account_title, currency }}
    //                     />
    //                 ),
    //                 text_submit: <Localize i18n_default_text='Transfer funds' />,
    //                 text_cancel: <Localize i18n_default_text='Maybe Later' />,
    //             },
    //         },
    //     },

    //     [CFD_PLATFORMS.MT5]: {},
    // };

    // success_modal_data[CFD_PLATFORMS.DXTRADE][Jurisdiction.SVG] = {
    //     demo: {
    //         title: (
    //             <Localize i18n_default_text='Your {{account_title}} demo account is ready' values={{ account_title }} />
    //         ),
    //         description: (
    //             <Localize
    //                 i18n_default_text='Transfer virtual funds from your demo Wallet to your {{account_title}} demo account to practise trading.'
    //                 values={{ account_title }}
    //             />
    //         ),
    //         text_submit: <Localize i18n_default_text='Transfer funds' />,
    //         text_cancel: <Localize i18n_default_text='Maybe Later' />,
    //     },
    //     real: {
    //         title: <Localize i18n_default_text='Your {{account_title}} account is ready' values={{ account_title }} />,
    //         description: (
    //             <Localize
    //                 i18n_default_text='Transfer funds from your {{currency}} Wallet to your {{account_title}} account to start trading.'
    //                 values={{ account_title, currency }}
    //             />
    //         ),
    //         text_submit: <Localize i18n_default_text='Transfer funds' />,
    //         text_cancel: <Localize i18n_default_text='Maybe Later' />,
    //     },
    // };
    // success_modal_data[CFD_PLATFORMS.DXTRADE][Jurisdiction.MALTA_INVEST] = [CFD_PLATFORMS.DXTRADE][Jurisdiction.SVG];
    // success_modal_data[CFD_PLATFORMS.DXTRADE][Jurisdiction.BVI] = [CFD_PLATFORMS.DXTRADE][Jurisdiction.SVG];
    // success_modal_data[CFD_PLATFORMS.DXTRADE][Jurisdiction.LABUAN] = [CFD_PLATFORMS.DXTRADE][Jurisdiction.SVG];
    // success_modal_data[CFD_PLATFORMS.DXTRADE][Jurisdiction.VANUATU] = [CFD_PLATFORMS.DXTRADE][Jurisdiction.SVG];

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
                    // text_cancel = ;
                } else {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{mt5_jurisdiction}} account. You’ll get an in-app notification as soon as this is done.'
                            values={{ mt5_jurisdiction }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
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
                    // text_cancel = <Localize i18n_default_text='Maybe Later' />;
                } else {
                    title = <Localize i18n_default_text='Almost there' />;
                    description = (
                        <Localize
                            i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{mt5_jurisdiction}} account. You’ll get an in-app notification as soon as this is done.'
                            values={{ mt5_jurisdiction }}
                        />
                    );
                    text_submit = <Localize i18n_default_text='Transfer funds' />;
                    text_cancel = <Localize i18n_default_text='Maybe Later' />;
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
                // text_cancel = <Localize i18n_default_text='Maybe Later' />;
            } else {
                title = <Localize i18n_default_text='Almost there' />;
                description = (
                    <Localize
                        i18n_default_text='We need a few minutes to review your documents before you can start trading with your {{mt5_jurisdiction}} account. You’ll get an in-app notification as soon as this is done.'
                        values={{ mt5_jurisdiction }}
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
    mt5_jurisdiction = Jurisdiction.SVG,
    platform = CFD_PLATFORMS.MT5,
    currency = 'USD'
) => {
    return WalletSuccessContentMapper(
        is_demo,
        account_title,
        description_title,
        type,
        mt5_jurisdiction,
        platform,
        currency
    );
};
