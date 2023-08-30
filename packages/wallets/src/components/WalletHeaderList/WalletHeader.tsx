import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletBalance from '../WalletBalance/WalletBalance';
import WalletCardIcon from '../WalletCardIcon/WalledCardIcon';
import WalletCurrencyTitle from '../WalletCurrencyTitle/WalletCurrencyTitle';
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
                                <WalletCardIcon />
                                <div className='wallet-list__action-container'>
                                    <div className='wallet-list__elements'>
                                        <WalletCurrencyTitle account={account} />
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
                            <WalletBalance account={account} />
                            <div className='wallet-list__toggle'>V</div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

export default WalletHeader;
