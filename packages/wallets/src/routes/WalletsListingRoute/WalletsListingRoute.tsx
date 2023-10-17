import React, { useState } from 'react';
import { DesktopWalletsList, WalletTourGuide, WalletsAddMoreCarousel, WalletsCarousel } from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;
