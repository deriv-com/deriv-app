import React, { useState } from 'react';
import { DesktopWalletsList, WalletsAddMoreCarousel, WalletsCarousel, WalletTourGuide } from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const [isStarted, setIsStarted] = useState(false);

    return (
        <div className='wallets-listing-route'>
            {/* TODO: delete this button when Header will be created in wallets package */}
            <button onClick={() => setIsStarted(prev => !prev)}>Wallet onboarding</button>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
            <WalletTourGuide isStarted={isStarted} setIsStarted={setIsStarted} />
        </div>
    );
};

export default WalletsListingRoute;
