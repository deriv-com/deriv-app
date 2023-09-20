import React from 'react';
import './WalletDepositCryptoCurrencyDetails.scss';

type TProps = {
    name?: string;
    display_code?: string;
};

const WalletDepositCryptoCurrencyDetails = ({ name, display_code }: TProps) => {
    return (
        <p className='wallets-deposit-crypto-currency-details'>
            Send only {name} ({display_code}) to this address.
        </p>
    );
};

export default WalletDepositCryptoCurrencyDetails;
