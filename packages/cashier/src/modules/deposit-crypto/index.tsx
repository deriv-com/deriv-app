import React, { useEffect } from 'react';
import { observer } from '@deriv/stores';
import CashierBreadcrumb from '../../components/cashier-breadcrumb';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { DepositCryptoCurrencyDetails, DepositCryptoTryFiatOnRamp, DepositCryptoWalletAddress } from './components';
import './deposit-crypto.scss';

const DepositCrypto: React.FC = observer(() => {
    const { general_store, transaction_history } = useCashierStore();
    const { setIsDeposit } = general_store;
    const { onMount: recentTransactionOnMount } = transaction_history;

    useEffect(() => {
        setIsDeposit(true);
        recentTransactionOnMount();
    }, [setIsDeposit, recentTransactionOnMount]);

    return (
        <PageContainer>
            <CashierBreadcrumb is_crypto_deposit />
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <div className='deposit-crypto__divider' />
            <DepositCryptoTryFiatOnRamp />
            {/* {is_mobile && <RecentTransaction />} */}
        </PageContainer>
    );
});

export default DepositCrypto;
