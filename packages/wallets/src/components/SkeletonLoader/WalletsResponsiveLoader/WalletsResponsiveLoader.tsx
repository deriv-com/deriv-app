import React from 'react';
import WalletsCarouselLoader from '../WalletsCarouselLoader/WalletsCarouselLoader';
import './WalletsResponsiveLoader.scss';

const WalletsResponsiveLoader: React.FC = () => {
    return (
        <div className='wallets-responsive-loader'>
            <WalletsCarouselLoader />
            <div className='wallets-responsive-loader__content'>
                <div className='wallets-skeleton wallets-responsive-loader__content-tabs' />
                <div className='wallets-skeleton wallets-responsive-loader__content-description' />
                <div className='wallets-skeleton wallets-responsive-loader__content-list' />
            </div>
        </div>
    );
};

export default WalletsResponsiveLoader;
