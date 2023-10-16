import React from 'react';
import DepositCryptoAddress from '../DepositCryptoAddress/DepositCryptoAddress';
import WalletDepositCryptoCurrencyDetails from '../DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import WalletDepositCryptoDisclaimers from '../WalletDepositCryptoDisclaimers/DepositCryptoDisclaimers';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    return (
        <div className='wallets-deposit-crypto'>
            <WalletDepositCryptoCurrencyDetails />
            <DepositCryptoAddress />
            <WalletDepositCryptoDisclaimers />
        </div>
    );
};

export default DepositCrypto;
