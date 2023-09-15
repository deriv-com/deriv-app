import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
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
                        <div className='wallets-list-header__details-container-icon'>
                            <WalletListCardIcon type={account?.wallet_currency_type} />
                        </div>
                    </WalletGradientBackground>

                    <WalletListCardIDetails account={account} />
                </div>
                <WalletListCardIBalance account={account} />
            </div>
        </div>
    );
};

export default WalletListCard;
