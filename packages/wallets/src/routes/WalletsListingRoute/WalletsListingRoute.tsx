import React, { lazy } from 'react';
import { useActiveWalletAccount, useAllWalletAccounts, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsResponsiveLoader,
    WalletTourGuide,
} from '../../components';
import { WalletsDisclaimerBanner } from '../../components/WalletsDisclaimerBanner';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isDesktop } = useDevice();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { data: wallets, isLoading: isWalletsLoading } = useAllWalletAccounts();
    const hasAddedWallet = wallets?.some(wallet => wallet.is_added);
    const { data: activeWallet } = useActiveWalletAccount();

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
            {isWalletsLoading || isEuRegionLoading || (isEuRegion && hasAddedWallet) ? null : (
                <WalletsAddMoreCarousel />
            )}
            <ResetMT5PasswordHandler />
            <WalletTourGuide />
            {isEuRegion && !activeWallet?.is_virtual && <WalletsDisclaimerBanner />}
        </div>
    );
};

export default WalletsListingRoute;
