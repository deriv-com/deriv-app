import React from 'react';
import './WalletDepositCryptoCurrencyDetails.scss';

type TProps = {
    name?: string;
    display_code?: string;
};

const WalletDepositCryptoCurrencyDetails = ({ name, display_code }: TProps) => {
    return (
        <h3 className='wallets-deposit-crypto-currency-details'>
            Send only {name} ({display_code}) to this address.
        </h3>
    );
};

export default WalletDepositCryptoCurrencyDetails;
