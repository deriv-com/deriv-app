import React, { useEffect } from 'react';
import { useHasSetCurrency } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import {
    CashierOnboardingCryptoCard,
    CashierOnboardingFiatCard,
    CashierOnboardingOnrampCard,
    CashierOnboardingP2PCard,
    CashierOnboardingPaymentAgentCard,
    CashierOnboardingSideNotes,
    CashierOnboardingTitle,
} from './components';

type TProps = {
    setSideNotes: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

const CashierOnboarding: React.FC<TProps> = observer(({ setSideNotes }) => {
    const history = useHistory();
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { setIsCashierOnboarding } = general_store;
    const { toggleSetCurrencyModal } = ui;
    const { can_change_fiat_currency, available_crypto_currencies, is_crypto } = client;
    const is_fiat_user = !is_crypto() && !can_change_fiat_currency;
    const is_crypto_user = is_crypto() && available_crypto_currencies.length > 0;
    const should_show_side_notes = is_fiat_user || is_crypto_user;
    const has_set_currency = useHasSetCurrency();

    useEffect(() => {
        setIsCashierOnboarding(true);

        return () => {
            setIsCashierOnboarding(false);
            if (!has_set_currency && window.location.pathname.includes(routes.cashier)) {
                history.push(routes.trade);
                toggleSetCurrencyModal();
            }
        };
    }, [has_set_currency, history, setIsCashierOnboarding, toggleSetCurrencyModal]);

    return (
        <PageContainer hide_breadcrumb>
            <CashierOnboardingTitle />
            <CashierOnboardingFiatCard />
            <CashierOnboardingCryptoCard />
            <CashierOnboardingOnrampCard />
            <CashierOnboardingPaymentAgentCard />
            <CashierOnboardingP2PCard />
            {should_show_side_notes && <CashierOnboardingSideNotes setSideNotes={setSideNotes} />}
        </PageContainer>
    );
});

export default CashierOnboarding;
