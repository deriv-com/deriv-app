import React from 'react';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    return (
        <div className='wallets-deposit-crypto'>
            <DepositCryptoCurrencyDetails />
            <DepositCryptoAddress />
            <DepositCryptoDisclaimers />
        </div>
    );
};

export default DepositCrypto;
