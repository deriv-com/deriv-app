import React, { lazy } from 'react';
import { useActiveWalletAccount, useAllWalletAccounts, useIsEuRegion } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import {
    WalletListHeader,
    WalletLoader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsDisclaimerBanner,
    WalletsResponsiveLoader,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import './WalletsListingRoute.scss';

type TWalletsListingRouteProps = {
    isHubRedirectionEnabled: boolean;
};

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC<TWalletsListingRouteProps> = ({ isHubRedirectionEnabled }) => {
    const { isDesktop } = useDevice();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: allWallets, isLoading: isAllWalletsLoading } = useAllWalletAccounts();
    const hasAddedWallet = allWallets?.some(wallet => wallet.is_added);
    const shouldHideAddMoreCarousel = isAllWalletsLoading || isEuRegionLoading || (isEuRegion && hasAddedWallet);

    if (isHubRedirectionEnabled) {
        return <WalletLoader />;
    }

    return (
        <div className='wallets-listing-route'>
            {isDesktop && <WalletListHeader />}
            {isDesktop ? (
                <React.Suspense fallback={<WalletsCardLoader />}>
                    <LazyDesktopWalletsList />
                </React.Suspense>
            ) : (
                <React.Suspense fallback={<WalletsResponsiveLoader />}>
                    <LazyWalletsCarousel />
                </React.Suspense>
            )}
            {shouldHideAddMoreCarousel ? null : <WalletsAddMoreCarousel />}
            <ResetMT5PasswordHandler />
            {isEuRegion && !activeWallet?.is_virtual && <WalletsDisclaimerBanner />}
        </div>
    );
};

export default WalletsListingRoute;
