import React from 'react';
import { useWalletAccountsList } from '@deriv/api';
import {
    DesktopWalletsList,
    WalletNoWalletFoundState,
    WalletsAddMoreCarousel,
    WalletsCarousel,
} from '../../components';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: walletAccounts } = useWalletAccountsList();

    if (!walletAccounts || !walletAccounts.length) return <WalletNoWalletFoundState />;

    return (
        <div className='wallets-listing-route'>
            {isMobile ? <WalletsCarousel /> : <DesktopWalletsList />}
            <WalletsAddMoreCarousel />
        </div>
    );
};

export default WalletsListingRoute;
