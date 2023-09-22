import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import './WalletDepositCryptoCurrencyDetails.scss';

const WalletDepositCryptoCurrencyDetails = () => {
    const { data } = useActiveWalletAccount();
    const { currency_config } = data || {};
    return (
        <p className='wallets-deposit-crypto-currency-details'>
            Send only {currency_config?.name} ({currency_config?.display_code}) to this address.
        </p>
    );
};

export default WalletDepositCryptoCurrencyDetails;
