import React, { useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletText } from '../Base';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

type TProps = {
    showWalletsCarouselHeader: boolean;
};

const WalletsCarousel: React.FC<TProps> = ({ showWalletsCarouselHeader }) => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    return (
        <React.Fragment>
            {!isActiveWalletLoading && (
                <WalletsCarouselHeader
                    balance={activeWallet?.display_balance}
                    currency={activeWallet?.currency || 'USD'}
                    hidden={!showWalletsCarouselHeader}
                    isDemo={activeWallet?.is_virtual}
                />
            )}
            <div className='wallets-carousel'>
                <div className='wallets-carousel__header'>
                    <WalletText size='xl' weight='bold'>
                        Trader&apos;s Hub
                    </WalletText>
                </div>
                <WalletsCarouselContent onWalletSettled={setIsWalletSettled} />
                <AccountsList isWalletSettled={isWalletSettled} />
            </div>
        </React.Fragment>
    );
};

export default WalletsCarousel;
