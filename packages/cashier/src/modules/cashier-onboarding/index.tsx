import React, { useEffect } from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import {
    CashierOnboardingCashCard,
    CashierOnboardingCryptoCard,
    CashierOnboardingOnrampCard,
    CashierOnboardingP2PCard,
    CashierOnboardingPaymentAgentCard,
    CashierOnboardingSideNotes,
    CashierOnboardingTitle,
} from './components';
import './onboarding.scss';
import { useHistory } from 'react-router';
import { useCashierStore } from 'Stores/useCashierStores';
import { routes } from '@deriv/shared';
import { useHasSetCurrency } from '@deriv/hooks';

type TProps = {
    setSideNotes: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

const CashierOnboardingModule: React.FC<TProps> = observer(({ setSideNotes }) => {
    const history = useHistory();
    const { client, ui } = useStore();
    const { general_store } = useCashierStore();
    const { onMountCashierOnboarding, setIsCashierOnboarding } = general_store;
    const { toggleSetCurrencyModal } = ui;
    const { can_change_fiat_currency, available_crypto_currencies, is_crypto } = client;
    const is_fiat_user = !is_crypto() && !can_change_fiat_currency;
    const is_crypto_user = is_crypto() && available_crypto_currencies.length > 0;
    const should_show_side_notes = is_fiat_user || is_crypto_user;
    const has_set_currency = useHasSetCurrency();

    useEffect(() => {
        onMountCashierOnboarding();

        return () => {
            setIsCashierOnboarding(false);
            if (!has_set_currency && window.location.pathname.includes(routes.cashier)) {
                history.push(routes.trade);
                toggleSetCurrencyModal();
            }
        };
    }, [has_set_currency, history, onMountCashierOnboarding, setIsCashierOnboarding, toggleSetCurrencyModal]);

    return (
        <ThemedScrollbars className='cashier-onboarding-page'>
            <CashierOnboardingTitle />
            <CashierOnboardingCashCard />
            <CashierOnboardingCryptoCard />
            <CashierOnboardingOnrampCard />
            <CashierOnboardingPaymentAgentCard />
            <CashierOnboardingP2PCard />
            {should_show_side_notes && <CashierOnboardingSideNotes setSideNotes={setSideNotes} />}
        </ThemedScrollbars>
    );
});

export default CashierOnboardingModule;
