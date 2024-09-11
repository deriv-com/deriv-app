import React, { lazy } from 'react';
import { useWalletAccountsList } from '@deriv/api-v2';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsResponsiveLoader,
    WalletTourGuide,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import useDevice from '../../hooks/useDevice';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isMobile } = useDevice();
    const { data: wallets } = useWalletAccountsList();

    const hasAnyActiveRealWallets = wallets?.some(wallet => !wallet.is_virtual && !wallet.is_disabled);

    return (
        <div className='wallets-listing-route'>
            <WalletListHeader />
            {isMobile ? (
                <React.Suspense fallback={<WalletsResponsiveLoader />}>
                    <LazyWalletsCarousel />
                </React.Suspense>
            ) : (
                <React.Suspense fallback={<WalletsCardLoader />}>
                    <LazyDesktopWalletsList />
                </React.Suspense>
            )}
            {hasAnyActiveRealWallets && <WalletsAddMoreCarousel />}
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
        </div>
    );
};

export default WalletsListingRoute;
