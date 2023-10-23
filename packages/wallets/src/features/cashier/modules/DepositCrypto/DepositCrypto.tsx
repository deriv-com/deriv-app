import React from 'react';
import { TransactionStatus } from '../TransactionStatus';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    return (
        <div className='wallets-deposit-crypto-container'>
            <div className='wallets-deposit-crypto'>
                <DepositCryptoCurrencyDetails />
                <DepositCryptoAddress />
                <DepositCryptoDisclaimers />
            </div>
            <TransactionStatus transactionType='deposit' />
        </div>
    );
};

export default DepositCrypto;
