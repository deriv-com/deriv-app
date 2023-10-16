import React from 'react';
import DepositCryptoAddress from '../DepositCryptoAddress/DepositCryptoAddress';
import WalletDepositCryptoCurrencyDetails from '../WalletDepositCryptoCurrencyDetails/WalletDepositCryptoCurrencyDetails';
import WalletDepositCryptoDisclaimers from '../WalletDepositCryptoDisclaimers/WalletDepositCryptoDisclaimers';
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
