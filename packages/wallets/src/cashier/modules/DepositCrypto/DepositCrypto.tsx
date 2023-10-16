import React from 'react';
import DepositCryptoAddress from './DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './DepositCryptoDisclaimers/DepositCryptoDisclaimers';
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
