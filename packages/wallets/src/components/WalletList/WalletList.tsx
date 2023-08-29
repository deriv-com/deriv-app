import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletList.scss';

const WalletList: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <div className='account-list'>
            {data?.map(account => {
                return (
                    <div className='account-item' key={account.loginid}>
                        <div className='currency'>{account.currency}</div>
                        <br />
                        <div className='account-category'>{account.landing_company_name}</div>
                        <br />
                        <div className='balance'>{account.balance}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default WalletList;
