import React from 'react';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';

const WalletsCarousel: React.FC = () => {
    return (
        <React.Fragment>
            <WalletsCarouselContent />
            <AccountsList />
        </React.Fragment>
    );
};

export default WalletsCarousel;
