import React from 'react';
import { WalletText } from '../../../../components';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoForm, WithdrawalDisclaimer } from './components';
import './WithdrawalCrypto.scss';

const WithdrawalCrypto = () => {
    return (
        <div className='wallets-withdrawal-crypto-container'>
            <div className='wallets-withdrawal-crypto'>
                <WalletText weight='bold'>Withdraw Bitcoin (BTC) to your wallet</WalletText>
                <WithdrawalDisclaimer />
                <WithdrawalCryptoForm />
            </div>
            <TransactionStatus transactionType='withdrawal' />
        </div>
    );
};

export default WithdrawalCrypto;
