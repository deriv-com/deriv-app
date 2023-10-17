import React from 'react';
import { DesktopWalletsList, WalletsAddMoreCarousel, WalletsCarousel } from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
        </div>
    );
};

export default WalletsListingRoute;
