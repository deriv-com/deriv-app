import React from 'react';
import { useAuthorize, useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import WalletListCardIBalance from '../WalletListCardIBalance/WalletListCardIBalance';
import WalletListCardIcon from '../WalletListCardIcon/WalletListCardIcon';
import WalletListCardIDetails from '../WalletListCardIDetails/WalletListCardIDetails';
import './WalletListCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCard: React.FC<TProps> = ({ account }) => {
    const { switchAccount } = useAuthorize();

    const handleSwitchAccount = () => {
        switchAccount(account.loginid);
    };

    return (
        <div className='wallets-list-header__card_container'>
            <div className='wallets-list-header__content'>
                <div className='wallets-list-header__details-container'>
                    <WalletListCardIcon />
                    <WalletListCardIDetails account={account} />
                </div>
                <WalletListCardIBalance account={account} />
                <div className='wallets-list-header__dropdown' onClick={handleSwitchAccount}>
                    <IcDropdown />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
