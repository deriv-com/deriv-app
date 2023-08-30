import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletBalance from '../WalletBalance/WalletBalance';
import WalletCardIcon from '../WalletCardIcon/WalledCardIcon';
import WalletCurrencyTitle from '../WalletCurrencyTitle/WalletCurrencyTitle';
import WalletLandingCompanyBadge from '../WalletLandingCompanyBadge/WalletLandingCompanyBadge';
import WalletHeaderActions from '../WalletHeaderActions/WalletHeaderActions';
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
                                        <WalletLandingCompanyBadge account={account} />
                                    </div>
                                    <WalletHeaderActions />
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
