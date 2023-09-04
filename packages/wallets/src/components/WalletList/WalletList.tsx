import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletList.scss';

const WalletList: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1 className='wallets-list-title'>No wallets found</h1>;

    return (
        <div className='wallets-list-account-list'>
            {data?.map(account => {
                return (
                    <div className='wallets-list-account-item' key={account.loginid}>
                        <div className='wallets-list-currency'>{account.currency}</div>
                        <br />
                        <div className='wallets-list-account-category'>{account.landing_company_name}</div>
                        <br />
                        <div className='wallets-list-balance'>{account.balance}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default WalletList;
