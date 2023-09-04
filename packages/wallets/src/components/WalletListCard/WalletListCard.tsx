import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import WalletBalance from '../WalletBalance/WalletBalance';
import WalletCardIcon from '../WalletCardIcon/WalledCardIcon';
import WalletListDetails from '../WalletListDetails/WalletListDetails';
import './WalletListCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-list-header__card_container' key={account.loginid}>
            <div className='wallets-list-header__content'>
                <div className='wallets-list-header__details-container'>
                    <WalletCardIcon />
                    <WalletListDetails account={account} />
                </div>
                <WalletBalance account={account} />
                <div className='wallets-list-header__dropdown'>
                    <IcDropdown />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
