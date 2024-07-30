import React from 'react';
import { usePaymentAgentList } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useCashierStore } from '../../../../stores/useCashierStores';
import { CashierOnboardingCard } from '../cashier-onboarding-card';

const CashierOnboardingPaymentAgentCard: React.FC = observer(() => {
    const { ui } = useStore();
    const { general_store } = useCashierStore();
    const { openRealAccountSignup, shouldNavigateAfterChooseCrypto } = ui;
    const { setDepositTarget, setShouldShowAllAvailableCurrencies } = general_store;
    const { data: all_payment_agent_list } = usePaymentAgentList();
    const is_payment_agent_visible_in_onboarding = Boolean(all_payment_agent_list?.length);

    const onClick = () => {
        setShouldShowAllAvailableCurrencies(true);
        setDepositTarget('/cashier/payment-agent');
        openRealAccountSignup('choose');
        shouldNavigateAfterChooseCrypto('/cashier/payment-agent');
    };

    if (!is_payment_agent_visible_in_onboarding) return null;

    return (
        <CashierOnboardingCard
            title={localize('Deposit via payment agents')}
            description={localize(
                'Deposit in your local currency via an authorised, independent payment agent in your country.'
            )}
            depositCategory='payment_agent'
            onClick={onClick}
        />
    );
});

export default CashierOnboardingPaymentAgentCard;
