import React, { useEffect } from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { observer } from '@deriv/stores';
import CashierBreadcrumb from 'Components/cashier-breadcrumb';
import { useCashierStore } from 'Stores/useCashierStores';
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
        <ThemedScrollbars className='deposit-crypto'>
            <CashierBreadcrumb is_crypto_deposit />
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <div className='deposit-crypto__divider' />
            <DepositCryptoTryFiatOnRamp />
            {/* {is_mobile && <RecentTransaction />} */}
        </ThemedScrollbars>
    );
});

export default DepositCrypto;
