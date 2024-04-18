import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import {
    DesktopWalletsList,
    WalletsAddMoreCarousel,
    WalletsCarousel,
    WalletsResetMT5Password,
    WalletTourGuide,
} from '../../components';
import { useModal } from '../../components/ModalProvider';
import { CFD_PLATFORMS } from '../../features/cfd/constants';
import ResetMT5PasswordHandler from '../../features/cfd/ResetMT5PasswordHandler';
import { getActionFromUrl } from '../../helpers/urls';
import useDevice from '../../hooks/useDevice';
import { TPlatforms } from '../../types';
import './WalletsListingRoute.scss';

const WalletsListingRoute: React.FC = () => {
    const [showWalletsCarouselHeader, setShowWalletsCarouselHeader] = useState(false);
    const [heightFromTop, setHeightFromTop] = useState(0);
    const { isMobile } = useDevice();
    const { show } = useModal();
    const containerRef = useRef<HTMLDivElement>(null);
    const resetTradingPlatformActionParams = getActionFromUrl();

    // function to handle scrolling event for hiding/displaying WalletsCarouselHeader
    // walletsCarouselHeader will be displayed when height from top of screen is more than 100px
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const newHeightFromTop = containerRef.current.getBoundingClientRect().top;
            setHeightFromTop(newHeightFromTop);
            heightFromTop && setShowWalletsCarouselHeader(heightFromTop < -100);
        }
    }, [heightFromTop]);

    //listen to various scroll events to handle wheel scrolling on desktop responsive and drag scrolling on mobile for various platforms
    useEventListener('touchmove', handleScroll, containerRef);
    useEventListener('touchend', handleScroll, containerRef);
    useEventListener('scroll', handleScroll, containerRef);
    useEventListener('wheel', handleScroll, containerRef);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            handleScroll();
        }

        return () => {
            isMounted = false;
        };
    }, [handleScroll, heightFromTop]);

    const platformMapping: Record<string, Exclude<TPlatforms.All, 'ctrader'>> = useMemo(
        () => ({
            trading_platform_dxtrade_password_reset: CFD_PLATFORMS.DXTRADE,
            trading_platform_mt5_password_reset: CFD_PLATFORMS.MT5,
        }),
        []
    );

    useEffect(() => {
        const platformKey = resetTradingPlatformActionParams ? platformMapping[resetTradingPlatformActionParams] : null;
        if (platformKey) {
            const verificationCode = localStorage.getItem(
                `verification_code.trading_platform_${platformKey}_password_reset`
            );

            if (verificationCode) {
                show(
                    <WalletsResetMT5Password
                        actionParams={resetTradingPlatformActionParams ?? ''}
                        platform={platformKey}
                        verificationCode={verificationCode}
                    />,
                    { defaultRootId: 'wallets_modal_root' }
                );
            }
        }
    }, [platformMapping, resetTradingPlatformActionParams, show]);

    return (
        <div className='wallets-listing-route' ref={containerRef}>
            {isMobile ? (
                <WalletsCarousel showWalletsCarouselHeader={showWalletsCarouselHeader} />
            ) : (
                <DesktopWalletsList />
            )}
            <WalletsAddMoreCarousel />
            {!isMobile && <WalletTourGuide />}
            <ResetMT5PasswordHandler />
        </div>
    );
};

export default WalletsListingRoute;
