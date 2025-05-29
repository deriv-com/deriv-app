import React, { lazy, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useActiveWalletAccount, useAllWalletAccounts, useIsEuRegion, useSettings } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import {
    WalletListHeader,
    WalletLoader,
    WalletsAddMoreCarousel,
    WalletsCardLoader,
    WalletsDisclaimerBanner,
    WalletsOutsystemsMigrationModal,
    WalletsResponsiveLoader,
} from '../../components';
import { useModal } from '../../components/ModalProvider';
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
    const { data: settingsData, isLoading: isSettingsLoading } = useSettings();
    const { data: activeWallet } = useActiveWalletAccount();
    const { show } = useModal();
    const { data: allWallets, isLoading: isAllWalletsLoading } = useAllWalletAccounts();
    const hasAddedWallet = allWallets?.some(wallet => wallet.is_added);
    const shouldHideAddMoreCarousel = isAllWalletsLoading || isEuRegionLoading || (isEuRegion && hasAddedWallet);
    const isOutsystemsMigrationModalClosed = Cookies.get('wallet_account');
    const [shouldShowOutsystemsMigrationModal, setShouldShowOutsystemsMigrationModal] = useState(false);

    useEffect(() => {
        if (!isSettingsLoading) {
            const isWalletFlagDisabled = settingsData?.feature_flag?.wallet === 0;
            // Fallback to cookie if BE flag is not available
            setShouldShowOutsystemsMigrationModal(
                settingsData?.feature_flag?.wallet !== undefined
                    ? isWalletFlagDisabled
                    : !isOutsystemsMigrationModalClosed
            );
        }
    }, [isSettingsLoading, settingsData, isOutsystemsMigrationModalClosed]);

    useEffect(() => {
        if (isHubRedirectionEnabled && shouldShowOutsystemsMigrationModal) {
            show(<WalletsOutsystemsMigrationModal />);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHubRedirectionEnabled, shouldShowOutsystemsMigrationModal]);

    if (isSettingsLoading) {
        return <WalletLoader />;
    }

    if (!shouldShowOutsystemsMigrationModal && isHubRedirectionEnabled) {
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
