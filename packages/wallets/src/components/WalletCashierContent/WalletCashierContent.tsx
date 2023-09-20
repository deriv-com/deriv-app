import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import useCashierParam from '../../hooks/useCashierParam';
import WalletDepositCrypto from '../WalletDepositCrypto/WalletDepositCrypto';
import WalletDepositFiat from '../WalletDepositFiat/WalletDepositFiat';
import './WalletCashierContent.scss';

type TProps = {
    data: ReturnType<typeof useActiveWalletAccount>['data'];
};

const WalletCashierContent = ({ data }: TProps) => {
    const { activeCashierTab } = useCashierParam();

    return (
        <div className='wallets-cashier-content'>
            {activeCashierTab === 'deposit' &&
                (data?.currency_config?.is_crypto ? <WalletDepositCrypto /> : <WalletDepositFiat />)}
        </div>
    );
};

export default WalletCashierContent;
