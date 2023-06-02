import React, { useEffect } from 'react';
import { observer } from '@deriv/stores';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import {
    DepositCryptoCurrencyDetails,
    DepositCryptoRecentTransactionSideNote,
    DepositCryptoTryFiatOnRamp,
    DepositCryptoWalletAddress,
} from './components';
import './deposit-crypto.scss';

const DepositCrypto: React.FC = observer(() => {
    const { general_store } = useCashierStore();
    const { setIsDeposit } = general_store;

    useEffect(() => {
        setIsDeposit(true);

        return () => {
            setIsDeposit(false);
        };
    }, [setIsDeposit]);

    return (
        <PageContainer right={<DepositCryptoRecentTransactionSideNote />}>
            <DepositCryptoCurrencyDetails />
            <DepositCryptoWalletAddress />
            <div className='deposit-crypto__divider' />
            <DepositCryptoTryFiatOnRamp />
        </PageContainer>
    );
});

export default DepositCrypto;
