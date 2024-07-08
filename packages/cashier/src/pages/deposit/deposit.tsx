import React from 'react';
import { useDepositLocked, useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import TransactionsCryptoHistory from '../../components/transactions-crypto-history';
import { PageContainer } from '../../components/page-container';
import { CashierOnboardingModule, DepositCryptoModule, DepositFiatModule } from '../../modules';
import { useCashierStore } from '../../stores/useCashierStores';
import DepositLocked from './deposit-locked';

const Deposit = observer(() => {
    const { traders_hub } = useStore();
    const is_deposit_locked = useDepositLocked();
    const currency_config = useCurrentCurrencyConfig();
    const { transaction_history, general_store } = useCashierStore();
    const { is_low_risk_cr_eu_real } = traders_hub;
    const { is_transactions_crypto_visible } = transaction_history;
    const { is_deposit } = general_store;

    if (is_deposit_locked)
        return (
            <PageContainer hide_breadcrumb>
                <DepositLocked />
            </PageContainer>
        );

    if (is_transactions_crypto_visible) return <TransactionsCryptoHistory />;

    if (!!currency_config && (is_deposit || is_low_risk_cr_eu_real)) {
        const is_crypto_provider = currency_config.platform.cashier.includes('crypto');

        return is_crypto_provider ? <DepositCryptoModule /> : <DepositFiatModule />;
    }

    return <CashierOnboardingModule />;
});

export default Deposit;
