import React from 'react';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { GetAccountStatus } from '@deriv/api-types';
import { CFD_PLATFORMS, getAuthenticationStatusInfo } from '@deriv/shared';

type TReviewMessageForMT5 = {
    account_type: { category: string; tyoe: string };
    platform: string;
    jurisdiction_selected_shortcode: string;
    should_restrict_bvi_account_creation: boolean;
    updateAccountStatus: () => void;
    account_status: GetAccountStatus;
};

const ReviewMessageForMT5 = ({
    updateAccountStatus,
    account_type,
    platform,
    jurisdiction_selected_shortcode,
    account_status,
}: TReviewMessageForMT5) => {
    React.useEffect(() => {
        updateAccountStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        poi_verified_for_bvi_labuan_maltainvest,
        poi_pending_for_bvi_labuan_maltainvest,
        poi_verified_for_vanuatu,
        poi_pending_for_vanuatu,
        manual_status,
        poa_verified,
    } = getAuthenticationStatusInfo(account_status);

    if (account_type.category === 'real' && platform === CFD_PLATFORMS.MT5) {
        if (jurisdiction_selected_shortcode === 'svg') {
            return (
                <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
            );
        } else if (jurisdiction_selected_shortcode === 'bvi') {
            if (poi_verified_for_bvi_labuan_maltainvest) {
                return (
                    <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
                );
            } else if (poi_pending_for_bvi_labuan_maltainvest && manual_status !== 'pending') {
                return (
                    <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />
                );
            }
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        } else if (['labuan', 'maltainvest'].includes(jurisdiction_selected_shortcode)) {
            if (poi_verified_for_bvi_labuan_maltainvest && poa_verified) {
                return (
                    <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
                );
            }
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        } else if (jurisdiction_selected_shortcode === 'vanuatu') {
            if (poi_verified_for_vanuatu) {
                return (
                    <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
                );
            } else if (poi_pending_for_vanuatu && manual_status !== 'pending') {
                return (
                    <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />
                );
            }
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
    }
    return null;
};

export default connect(({ client, modules }: RootStore) => ({
    updateAccountStatus: client.updateAccountStatus,
    account_type: modules.cfd.account_type,
    jurisdiction_selected_shortcode: modules.cfd.jurisdiction_selected_shortcode,
    account_status: client.account_status,
}))(ReviewMessageForMT5);
