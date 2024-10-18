import React, { lazy } from 'react';
import { useDevice } from '@deriv-com/ui';
import { WalletListHeader, WalletsAddMoreCarousel, WalletsCardLoader, WalletsResponsiveLoader } from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isDesktop } = useDevice();

    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isDesktop ? (
                <React.Suspense fallback={<WalletsCardLoader />}>
                    <LazyDesktopWalletsList />
                </React.Suspense>
            ) : (
                <React.Suspense fallback={<WalletsResponsiveLoader />}>
                    <LazyWalletsCarousel />
                </React.Suspense>
            )}
            <WalletsAddMoreCarousel />
            <ResetMT5PasswordHandler />
        </div>
    );
};

export default WalletsListingRoute;
