import React from 'react';
import { useDepositLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { useCashierStore } from '../../stores/useCashierStores';
import { CashierOnboardingModule } from '../../modules/cashier-onboarding';
import PageContainer from '../../components/page-container';
import DepositFiatModule from '../../modules/deposit-fiat/deposit-fiat';
import DepositCryptoModule from '../../modules/deposit-crypto/deposit-crypto';
import TransactionsCryptoHistory from '../../components/transactions-crypto-history';
import DepositLocked from './deposit-locked';

const Deposit = observer(() => {
    const { traders_hub } = useStore();
    const { transaction_history, general_store } = useCashierStore();
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_transactions_crypto_visible } = transaction_history;
    const { is_crypto, is_deposit } = general_store;
    const is_deposit_locked = useDepositLocked();

    if (is_deposit_locked)
        return (
            <PageContainer hide_breadcrumb right={<React.Fragment />}>
                <DepositLocked />
            </PageContainer>
        );

    if (is_transactions_crypto_visible)
        return (
            <PageContainer hide_breadcrumb>
                <TransactionsCryptoHistory />
            </PageContainer>
        );

    if (is_deposit || is_low_risk_cr_eu_real) {
        if (is_crypto) return <DepositCryptoModule />;

        return <DepositFiatModule />;
    }

    return <CashierOnboardingModule />;
});

export default Deposit;
