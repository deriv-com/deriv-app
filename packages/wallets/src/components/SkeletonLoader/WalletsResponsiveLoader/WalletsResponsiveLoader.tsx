import React from 'react';
import WalletsCarouselLoader from '../WalletsCarouselLoader/WalletsCarouselLoader';
import WalletsTabsLoader from '../WalletsTabsLoader/WalletsTabsLoader';
import './WalletsResponsiveLoader.scss';

const WalletsResponsiveLoader: React.FC = () => {
    return (
        <div className='wallets-responsive-loader'>
            <WalletsCarouselLoader />
            <WalletsTabsLoader />
        </div>
    );
};

export default WalletsResponsiveLoader;
