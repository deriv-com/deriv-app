import React, { useState } from 'react';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';

const WalletsCarousel: React.FC = () => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);

    return (
        <React.Fragment>
            <WalletsCarouselContent onWalletSettled={setIsWalletSettled} />
            <AccountsList isWalletSettled={isWalletSettled} />
        </React.Fragment>
    );
};

export default WalletsCarousel;
