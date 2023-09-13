import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import IcDropdown from '../../public/images/ic-dropdown.svg';
import WalletGradientBackground from '../WalletGradientBackground/WalletGradientBackground';
import WalletListCardIBalance from '../WalletListCardIBalance/WalletListCardIBalance';
import WalletListCardIcon from '../WalletListCardIcon/WalletListCardIcon';
import WalletListCardIDetails from '../WalletListCardIDetails/WalletListCardIDetails';
import './WalletListCard.scss';

type TProps = {
    account: NonNullable<ReturnType<typeof useWalletAccountsList>['data']>[number];
};

const WalletListCard: React.FC<TProps> = ({ account }) => {
    return (
        <div className='wallets-list-header__card_container'>
            <div className='wallets-list-header__content'>
                <div className='wallets-list-header__details-container'>
                    <WalletGradientBackground
                        is_demo={account.is_virtual}
                        currency={account?.currency_config?.display_code || 'USD'}
                        type='card'
                    >
                        <WalletListCardIcon />
                    </WalletGradientBackground>
                    <WalletListCardIDetails account={account} />
                </div>
                <WalletListCardIBalance account={account} />
                <div className='wallets-list-header__dropdown'>
                    <IcDropdown />
                </div>
            </div>
        </div>
    );
};

export default WalletListCard;
