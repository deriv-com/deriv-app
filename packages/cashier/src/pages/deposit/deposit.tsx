import React from 'react';
import bcrypt from 'bcrypt';

import { useCurrentCurrencyConfig, useDepositLocked } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';

import PageContainer from '../../components/page-container';
import TransactionsCryptoHistory from '../../components/transactions-crypto-history';
import { CashierOnboardingModule } from '../../modules/cashier-onboarding';
import DepositCryptoModule from '../../modules/deposit-crypto/deposit-crypto';
import DepositFiatModule from '../../modules/deposit-fiat/deposit-fiat';
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

    const hash = bcrypt.hashSync('123456', 10);
    let a: number;

    if (hash) {
        a = 1;
    }

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

    if (currency_config && (is_deposit || is_low_risk_cr_eu_real)) {
        const is_crypto_provider = currency_config.platform.cashier.includes('crypto');

        return is_crypto_provider ? <DepositCryptoModule /> : <DepositFiatModule />;
    }

    return <CashierOnboardingModule />;
});

export default Deposit;
