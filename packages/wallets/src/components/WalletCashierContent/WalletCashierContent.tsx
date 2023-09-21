import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useCashierParam from '../../hooks/useCashierParam';
import WalletDepositCrypto from '../WalletDepositCrypto/WalletDepositCrypto';
import WalletDepositFiat from '../WalletDepositFiat/WalletDepositFiat';
import { WalletTransfer } from '../WalletTransfer';
import './WalletCashierContent.scss';

const WalletCashierContent = () => {
    const { data } = useActiveWalletAccount();
    const { activeCashierTab } = useCashierParam();

    return (
        <div className='wallets-cashier-content'>
            {activeCashierTab === 'deposit' &&
                (data?.currency_config?.is_crypto ? <WalletDepositCrypto /> : <WalletDepositFiat />)}
            {activeCashierTab === 'transfer' && <WalletTransfer />}
        </div>
    );
};

export default WalletCashierContent;
