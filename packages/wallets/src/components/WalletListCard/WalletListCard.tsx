import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import WalletBalance from '../WalletBalance/WalletBalance';
import WalletCardIcon from '../WalletCardIcon/WalledCardIcon';
import WalletListDetails from '../WalletListDetails/WalletListDetails';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import './WalletListCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallet-list-header__card_container' key={account.loginid}>
            <div className='wallet-list-header__content'>
                <div className='wallet-list-header__details-container'>
                    <WalletCardIcon />
                    <WalletListDetails account={account} />
                </div>
                <WalletBalance account={account} />
                <div className='wallet-list-header__dropdown'>
                    <IcDropdown />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
