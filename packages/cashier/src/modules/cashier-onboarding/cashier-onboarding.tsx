import React, { useEffect } from 'react';
import { Analytics } from '@deriv-com/analytics';
import { useHasSetCurrency } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';
import PageContainer from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
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
    const { client, ui } = useStore();
    const { loginid } = client;
    const { general_store } = useCashierStore();
    const { setIsCashierOnboarding } = general_store;
    const { toggleSetCurrencyModal } = ui;
    const has_set_currency = useHasSetCurrency();

    useEffect(() => {
        if (loginid) {
            Analytics.trackEvent('ce_cashier_deposit_onboarding_form', {
                action: 'open',
                form_name: 'ce_cashier_deposit_onboarding_form',
                login_id: loginid,
            });
        }
    }, [loginid]);

    useEffect(() => {
        setIsCashierOnboarding(true);

        return () => {
            setIsCashierOnboarding(false);
            if (!has_set_currency && window.location.pathname.includes('/cashier')) {
                history.push('/');
                toggleSetCurrencyModal();
            }
        };
    }, [has_set_currency, history, setIsCashierOnboarding, toggleSetCurrencyModal]);

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
