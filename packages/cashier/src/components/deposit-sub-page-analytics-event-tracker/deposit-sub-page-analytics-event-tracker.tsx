import React, { useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useStore } from '@deriv/stores';

type TProps = { deposit_category: 'crypto' | 'fiat' | 'fiat_onramp' | 'payment_agent' | 'p2p' };

const DepositSubPageAnalyticsEventTracker: React.FC<TProps> = ({ deposit_category }) => {
    const { client } = useStore();
    const { currency, loginid } = client;

    useEffect(() => {
        Analytics.trackEvent('ce_cashier_deposit_onboarding_form', {
            action: 'open_deposit_subpage',
            form_name: 'ce_cashier_deposit_onboarding_form',
            currency,
            deposit_category,
            login_id: loginid,
        });
    }, [currency, deposit_category, loginid]);

    return null;
};

export default DepositSubPageAnalyticsEventTracker;
