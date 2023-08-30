import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletCurrencyTitle.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletCurrencyTitle: React.FC<TProps> = ({ account }) => {
    return <div className='wallet-currency__title'>{account.currency_config?.display_code} Wallet</div>;
};

export default WalletCurrencyTitle;
