import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import AccountsList from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';

const WalletsCarousel: React.FC = () => {
    const { data: active_wallet } = useActiveWalletAccount();
    return (
        <React.Fragment>
            <WalletsCarouselContent />
            <AccountsList data={active_wallet} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
