import React from 'react';
import { usePaymentAgentList } from '@deriv/hooks';
import { routes } from '@deriv/shared';
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
        setDepositTarget(routes.cashier_pa);
        openRealAccountSignup('choose');
        shouldNavigateAfterChooseCrypto(routes.cashier_pa);
    };

    if (!is_payment_agent_visible_in_onboarding) return null;

    return (
        <CashierOnboardingCard
            title={localize('Deposit via payment agents')}
            description={localize(
                'Deposit in your local currency via an authorised, independent payment agent in your country.'
            )}
            onClick={onClick}
        />
    );
});

export default CashierOnboardingPaymentAgentCard;
