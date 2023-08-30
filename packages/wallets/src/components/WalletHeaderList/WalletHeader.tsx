import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletHeader.scss';

const WalletHeader: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <>
            {data?.map(account => {
                return (
                    <div className='wallet-list__card_container' key={account.loginid}>
                        <div className='wallet-list__content'>
                            <div className='wallet-list__details-container'>
                                <div className='wallet-list__wallet-icon'>
                                    <p> Icon (Placeholder)</p>
                                </div>
                            </div>
                            <WalletCardBalance account={account} />
                            <div className='wallet-list__toggle'>V</div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default WalletHeader;

const WalletCardBalance = ({ account }) => {
    return (
        <div className='wallet-list__balance-container'>
            <div className='wallet-list__balance-title'>Wallet balance</div>
            <div className='wallet-list__balance-value'>
                {account.balance.toLocaleString()} {account.currency_config?.display_code}
            </div>
        </div>
    );
};
