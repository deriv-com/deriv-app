import React, { useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';

const WalletsCarousel: React.FC = () => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    return (
        <React.Fragment>
            {!isActiveWalletLoading && (
                <WalletsCarouselHeader
                    balance={activeWallet?.display_balance}
                    currency={activeWallet?.currency || 'USD'}
                    isDemo={activeWallet?.is_virtual}
                />
            )}
            <WalletsCarouselContent onWalletSettled={setIsWalletSettled} />
            <AccountsList isWalletSettled={isWalletSettled} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
