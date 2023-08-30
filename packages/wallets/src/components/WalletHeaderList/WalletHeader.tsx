import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import './WalletHeader.scss';

const WalletHeader: React.FC = () => {
    const { data } = useWalletAccountsList();

    if (!data.length) return <h1>No wallets found</h1>;

    return (
        <React.Fragment>
            {data?.map(account => {
                return (
                    <div className='wallet-list__card_container' key={account.loginid}>
                        <div className='wallet-list__content'>
                            <div className='wallet-list__details-container'>
                                <div className='wallet-list__wallet-icon'>
                                    <p> Icon (Placeholder)</p>
                                </div>
                                <div className='wallet-list__action-container'>
                                    <div className='wallet-list__elements'>
                                        <div className='wallet-list__title'>
                                            {account.currency_config?.display_code} Wallet
                                        </div>
                                        <div className='wallet-list__badge'>
                                            <div className='wallet-list__landing-company-name'>
                                                <p>{account.landing_company_name?.toLocaleUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='wallet-list__actions'>
                                        <p>Deposit</p>
                                        <p>Withdraw</p>
                                        <p>Transfer</p>
                                        <p>Transactions</p>
                                    </div>
                                </div>
                            </div>
                            <WalletCardBalance account={account} />
                            <div className='wallet-list__toggle'>V</div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
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
