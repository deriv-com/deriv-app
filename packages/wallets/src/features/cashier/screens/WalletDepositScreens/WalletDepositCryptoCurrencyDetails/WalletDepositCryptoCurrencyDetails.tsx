import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import './WalletDepositCryptoCurrencyDetails.scss';

const WalletDepositCryptoCurrencyDetails = () => {
    const { data } = useActiveWalletAccount();

    return (
        <p className='wallets-deposit-crypto-currency-details'>
            Send only {data?.currency_config?.name} ({data?.currency_config?.display_code}) to this address.
        </p>
    );
};

export default WalletDepositCryptoCurrencyDetails;
