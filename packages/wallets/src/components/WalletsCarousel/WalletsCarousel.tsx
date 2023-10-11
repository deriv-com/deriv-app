import React from 'react';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC = () => {
    return (
        <div className='wallets-carousel'>
            <WalletsCarouselContent />
            <AccountsList />
        </div>
    );
};

export default WalletsCarousel;
