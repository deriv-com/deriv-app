import React, { lazy } from 'react';
import { useActiveWalletAccount, useAllWalletAccounts, useIsEuRegion, useWalletAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import {
    WalletListHeader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsDisclaimerBanner,
    WalletsResponsiveLoader,
} from '../../components';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import './WalletsListingRoute.scss';

const LazyWalletsCarousel = lazy(() => import('../../components/WalletsCarousel/WalletsCarousel'));
const LazyDesktopWalletsList = lazy(() => import('../../components/DesktopWalletsList/DesktopWalletsList'));

const WalletsListingRoute: React.FC = () => {
    const { isDesktop } = useDevice();
    const { data: wallets } = useWalletAccountsList();
    const { data: isEuRegion, isLoading: isEuRegionLoading } = useIsEuRegion();
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: allWallets, isLoading: isAllWalletsLoading } = useAllWalletAccounts();
    const hasAnyActiveRealWallets = wallets?.some(wallet => !wallet.is_virtual && !wallet.is_disabled);
    const hasAllRealWalletsDisabled = !hasAnyActiveRealWallets && (wallets?.length ?? 0) > 1;
    const hasAddedWallet = allWallets?.some(wallet => wallet.is_added);

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
            {hasAllRealWalletsDisabled ||
            isAllWalletsLoading ||
            isEuRegionLoading ||
            (isEuRegion && hasAddedWallet) ? null : (
                <WalletsAddMoreCarousel />
            )}
            <ResetMT5PasswordHandler />
            {isEuRegion && !activeWallet?.is_virtual && <WalletsDisclaimerBanner />}
        </div>
    );
};

export default WalletsListingRoute;
