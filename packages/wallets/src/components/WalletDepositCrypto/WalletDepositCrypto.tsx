import React from 'react';
import WalletDepositCryptoAddress from '../WalletDepositCryptoAddress/WalletDepositCryptoAddress';
import WalletDepositCryptoCurrencyDetails from '../WalletDepositCryptoCurrencyDetails/WalletDepositCryptoCurrencyDetails';
import WalletDepositCryptoDisclaimers from '../WalletDepositCryptoDisclaimers/WalletDepositCryptoDisclaimers';
import './WalletDepositCrypto.scss';

const WalletDepositCrypto = () => {
    return (
        <div className='wallets-deposit-crypto'>
            <WalletDepositCryptoCurrencyDetails />
            <WalletDepositCryptoAddress />
            <WalletDepositCryptoDisclaimers />
        </div>
    );
};

export default WalletDepositCrypto;
