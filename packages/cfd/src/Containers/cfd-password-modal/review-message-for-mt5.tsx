import { Localize } from '@deriv/translations';

import { JURISDICTION } from '../../Helpers/cfd-config';

import '../../sass/cfd.scss';
import { TReviewMsgForMT5 } from './cfd-password-modal.types.js';

const ReviewMessageForMT5 = ({
    is_selected_mt5_verified,
    jurisdiction_selected_shortcode,
    manual_status,
}: TReviewMsgForMT5) => {
    if (is_selected_mt5_verified) {
        return <Localize i18n_default_text='Enable trading with your first transfer.' />;
    } else if (
        jurisdiction_selected_shortcode === JURISDICTION.BVI ||
        jurisdiction_selected_shortcode === JURISDICTION.VANUATU
    ) {
        if (manual_status === 'pending') {
            return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
        }
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 5 minutes.' />;
    } else if (jurisdiction_selected_shortcode === JURISDICTION.LABUAN) {
        return <Localize i18n_default_text='We’re reviewing your documents. This should take about 1 to 3 days.' />;
    } else if (jurisdiction_selected_shortcode === JURISDICTION.MALTA_INVEST) {
        return (
            <Localize i18n_default_text='To start trading, transfer funds from your Deriv account into this account.' />
        );
    }
    return null;
};

export default ReviewMessageForMT5;
