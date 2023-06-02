import React, { useEffect } from 'react';
import { useHasSetCurrency } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';
import { PageContainer } from '../../components/page-container';
import {
    CashierOnboardingAccountIdentifierMessage,
    CashierOnboardingCryptoCard,
    CashierOnboardingFiatCard,
    CashierOnboardingOnrampCard,
    CashierOnboardingP2PCard,
    CashierOnboardingPaymentAgentCard,
    CashierOnboardingSideNotes,
} from './components';

const CashierOnboarding: React.FC = observer(() => {
    const history = useHistory();
    const { ui } = useStore();
    const { toggleSetCurrencyModal } = ui;
    const has_set_currency = useHasSetCurrency();

    useEffect(() => {
        return () => {
            if (!has_set_currency && window.location.pathname.includes(routes.cashier)) {
                history.push(routes.trade);
                toggleSetCurrencyModal();
            }
        };
    }, [has_set_currency, history, toggleSetCurrencyModal]);

    return (
        <PageContainer hide_breadcrumb right={<CashierOnboardingSideNotes />}>
            <CashierOnboardingAccountIdentifierMessage />
            <CashierOnboardingFiatCard />
            <CashierOnboardingCryptoCard />
            <CashierOnboardingOnrampCard />
            <CashierOnboardingPaymentAgentCard />
            <CashierOnboardingP2PCard />
        </PageContainer>
    );
});

export default CashierOnboarding;
