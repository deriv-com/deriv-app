import React, { useEffect } from 'react';
import { observer } from '@deriv/stores';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import {
    DepositCryptoCurrencyDetails,
    DepositCryptoResentTransactionSideNote,
    DepositCryptoTryFiatOnRamp,
    DepositCryptoWalletAddress,
} from './components';
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
        <PageContainer right={<DepositCryptoResentTransactionSideNote />}>
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <div className='deposit-crypto__divider' />
            <DepositCryptoTryFiatOnRamp />
        </PageContainer>
    );
});

export default DepositCrypto;
