import React from 'react';
import { CFD_PLATFORMS, getCFDPlatformLabel, Jurisdiction } from '@deriv/shared';
import {
    getDerivezCompanies,
    getDxCompanies,
    getFormattedJurisdictionCode,
    getMtCompanies,
    TDerivezCompanies,
    TDxCompanies,
    TMtCompanies,
} from '../../../Stores/Modules/CFD/Helpers/cfd-config';
import { Localize, localize } from '@deriv/translations';
import { ACCOUNT_CATEGORY } from 'Constants/cfd-password-modal-constants';

type TReviewMsgForMT5 = {
    is_selected_mt5_verified: boolean;
    jurisdiction_selected_shortcode: string;
    manual_status: string;
};

type TPasswordModalMessage = TReviewMsgForMT5 & {
    category: string;
    is_wallet_enabled: boolean;
    platform: string;
    wallet_account_title: string;
    show_eu_related_content: boolean;
    type: string;
};

const ReviewMessageForMT5 = ({
    is_selected_mt5_verified,
    jurisdiction_selected_shortcode,
    manual_status,
}: TReviewMsgForMT5) => {
    if (is_selected_mt5_verified) {
        return (
            <Localize i18n_default_text='To start trading, top-up funds from your Deriv account into this account.' />
        );
    } else if ([Jurisdiction.BVI, Jurisdiction.VANUATU].includes(jurisdiction_selected_shortcode)) {
        if (manual_status === 'pending') {
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />;
    } else if ([Jurisdiction.LABUAN, Jurisdiction.MALTA_INVEST].includes(jurisdiction_selected_shortcode)) {
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
    }
    return null;
};

const PasswordModalMessage = ({
    category,
    is_selected_mt5_verified,
    is_wallet_enabled,
    jurisdiction_selected_shortcode,
    manual_status,
    platform,
    show_eu_related_content,
    type,
    wallet_account_title,
}: TPasswordModalMessage) => {
    if (!category && !type) return null;

    const category_label = ACCOUNT_CATEGORY.REAL ? localize('Real') : localize('Demo');
    let type_label = '';
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            type_label =
                getMtCompanies(show_eu_related_content)[category as keyof TMtCompanies][
                    type as keyof TMtCompanies['demo' | 'real']
                ].short_title;
            break;
        case CFD_PLATFORMS.DXTRADE:
            type_label =
                getDxCompanies()[category as keyof TDxCompanies][type as keyof TDxCompanies['demo' | 'real']]
                    .short_title;
            break;
        case CFD_PLATFORMS.DERIVEZ:
            type_label =
                getDerivezCompanies()[category as keyof TDerivezCompanies][
                    type as keyof TDerivezCompanies['demo' | 'real']
                ].short_title;
            break;
        default:
            type_label = '';
            break;
    }

    const jurisdiction_label =
        jurisdiction_selected_shortcode && getFormattedJurisdictionCode(jurisdiction_selected_shortcode);
    const mt5_platform_label = jurisdiction_selected_shortcode !== Jurisdiction.MALTA_INVEST ? 'Deriv MT5' : '';

    if (category === ACCOUNT_CATEGORY.REAL) {
        return (
            <React.Fragment>
                <Localize
                    i18n_default_text='Congratulations, you have successfully created your {{category}} <0>{{platform}}</0> <1>{{type}} {{jurisdiction_selected_shortcode}}</1> account. '
                    values={{
                        type: type_label,
                        platform: platform === CFD_PLATFORMS.MT5 ? mt5_platform_label : getCFDPlatformLabel(platform),
                        category: category_label,
                        jurisdiction_selected_shortcode:
                            platform === CFD_PLATFORMS.MT5 && !show_eu_related_content ? jurisdiction_label : '',
                    }}
                    components={[<span key={0} className='cfd-account__platform' />, <strong key={1} />]}
                />
                {platform === CFD_PLATFORMS.DXTRADE ? (
                    <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
                ) : (
                    <ReviewMessageForMT5
                        is_selected_mt5_verified={is_selected_mt5_verified}
                        jurisdiction_selected_shortcode={jurisdiction_label}
                        manual_status={manual_status}
                    />
                )}
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {is_wallet_enabled && platform == CFD_PLATFORMS.MT5 ? (
                <Localize
                    i18n_default_text='You can now start practicing trading with your {{wallet_account_title}} {{category_label}} account.'
                    values={{
                        wallet_account_title,
                        category_label,
                    }}
                />
            ) : (
                <Localize
                    i18n_default_text='Congratulations, you have successfully created your {{category}} <0>{{platform}}</0> <1>{{type}}</1> account. '
                    values={{
                        type: type_label,
                        platform: getCFDPlatformLabel(platform),
                        category: category_label,
                    }}
                    components={[<span key={0} className='cfd-account__platform' />, <strong key={1} />]}
                />
            )}
        </React.Fragment>
    );
};

export default PasswordModalMessage;
