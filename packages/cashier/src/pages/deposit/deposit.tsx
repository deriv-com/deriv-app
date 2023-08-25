import React from 'react';
import { useDepositLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import CryptoTransactionsHistory from '../../components/crypto-transactions-history';
import { PageContainer } from '../../components/page-container';
import { CashierOnboardingModule, DepositCryptoModule, DepositFiatModule } from '../../modules';
import { useCashierStore } from '../../stores/useCashierStores';
import DepositLocked from './deposit-locked';

const Deposit = observer(() => {
    const { traders_hub } = useStore();
    const { transaction_history, general_store } = useCashierStore();
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_crypto_transactions_visible } = transaction_history;
    const { is_crypto, is_deposit } = general_store;
    const is_deposit_locked = useDepositLocked();

    if (is_deposit_locked)
        return (
            <PageContainer hide_breadcrumb>
                <DepositLocked />
            </PageContainer>
        );

    if (is_crypto_transactions_visible) return <CryptoTransactionsHistory />;

    if (is_deposit || is_low_risk_cr_eu_real) {
        if (is_crypto) return <DepositCryptoModule />;

        return <DepositFiatModule />;
    }

    return <CashierOnboardingModule />;
});

export default Deposit;
