import React, { useEffect } from 'react';
import { observer, useStore } from '@deriv/stores';
import RecentTransaction from 'Components/recent-transaction';
import { PageContainer } from '../../components/page-container';
import { useCashierStore } from '../../stores/useCashierStores';
import { DepositCryptoCurrencyDetails, DepositCryptoTryFiatOnRamp, DepositCryptoWalletAddress } from './components';
import './deposit-crypto.scss';

const DepositCrypto: React.FC = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;
    const { general_store, transaction_history } = useCashierStore();
    const { setIsDeposit } = general_store;
    const { onMount: recentTransactionOnMount } = transaction_history;

    useEffect(() => {
        setIsDeposit(true);
        recentTransactionOnMount();
    }, [setIsDeposit, recentTransactionOnMount]);

    return (
        <PageContainer>
            <div className='deposit-crypto'>
                <DepositCryptoCurrencyDetails />
                <DepositCryptoWalletAddress />
                {is_mobile && <div className='deposit-crypto__divider' />}
                {is_mobile && <RecentTransaction />}
                <div className='deposit-crypto__divider' />
                <DepositCryptoTryFiatOnRamp />
            </div>
        </PageContainer>
    );
});

export default DepositCrypto;
