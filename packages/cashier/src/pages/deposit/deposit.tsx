import React from 'react';
import { Loading } from '@deriv/components';
import { useCashierLocked, useDepositLocked, useIsSystemMaintenance } from '@deriv/hooks';
import { useStore, observer } from '@deriv/stores';
import { Real, Virtual } from '../../components/cashier-container';
import CashierLocked from '../../components/cashier-locked';
import CryptoTransactionsHistory from '../../components/crypto-transactions-history';
import Error from '../../components/error';
import FundsProtection from '../../components/funds-protection';
import DepositLocked from './deposit-locked';
import { useCashierStore } from '../../stores/useCashierStores';
import { CashierOnboardingModule, DepositCryptoModule, DepositFiatModule } from '../../modules';

const Deposit = observer(() => {
    const { client, traders_hub } = useStore();
    const { current_currency_type, is_switching, is_virtual } = client;
    const { iframe, deposit, transaction_history, general_store } = useCashierStore();
    const { iframe_url } = iframe;
    const { container, error, onMountDeposit: onMount } = deposit;
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_crypto_transactions_visible, onMount: recentTransactionOnMount } = transaction_history;
    const { is_cashier_onboarding, is_crypto, is_deposit, is_loading, setActiveTab } = general_store;
    const is_cashier_locked = useCashierLocked();
    const is_system_maintenance = useIsSystemMaintenance();
    const is_deposit_locked = useDepositLocked();

    React.useEffect(() => {
        if (!is_crypto_transactions_visible) {
            recentTransactionOnMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    React.useEffect(() => {
        setActiveTab(container);
        onMount();

        return () => {
            error.setErrorMessage({ code: '', message: '' });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActiveTab, onMount, container, error.setErrorMessage]);

    if (!is_cashier_onboarding && (is_switching || (is_loading && !iframe_url)) && !is_crypto_transactions_visible) {
        return <Loading is_fullscreen />;
    }
    if (is_virtual) {
        return <Virtual />;
    }
    if (is_system_maintenance) {
        if (is_cashier_locked || (is_deposit_locked && current_currency_type === 'crypto')) {
            return <CashierLocked />;
        }
    }
    if (error.is_ask_uk_funds_protection) return <FundsProtection />;

    if (is_cashier_locked) return <CashierLocked />;

    if (is_deposit_locked) return <DepositLocked />;

    if (is_crypto_transactions_visible) return <CryptoTransactionsHistory />;

    if (is_deposit || is_low_risk_cr_eu_real) {
        if (error.message) return <Error error={error} />;
        if (is_crypto) return <DepositCryptoModule />;

        return <DepositFiatModule />;
    }

    return <CashierOnboardingModule />;
});

export default Deposit;
