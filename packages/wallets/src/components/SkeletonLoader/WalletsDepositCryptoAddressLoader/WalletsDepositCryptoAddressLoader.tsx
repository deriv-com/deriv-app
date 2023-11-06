import React from 'react';
import './WalletsDepositCryptoAddressLoader.scss';

const WalletsDepositCryptoAddressLoader = () => {
    return (
        <div className='wallets-deposit-crypto-address-loader'>
            <div className='wallets-deposit-crypto-address-loader__qr-code wallets-skeleton' />
            <div className='wallets-deposit-crypto-address-loader__text wallets-skeleton' />
        </div>
    );
};

export default WalletsDepositCryptoAddressLoader;
