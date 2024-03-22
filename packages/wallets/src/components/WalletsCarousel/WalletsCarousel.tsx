import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC = () => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);
    const [showWalletsCarouselHeader, setShowWalletsCarouselHeader] = useState(false);
    const [heightFromTop, setHeightFromTop] = useState(0);
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    const containerRef = useRef<HTMLDivElement>(null);

    // function to handle scrolling event for hiding/displaying WalletsCarouselHeader
    // walletsCarouselHeader will be displayed when height from top of screen is more than 100px
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const newHeightFromTop = containerRef.current.getBoundingClientRect().top;
            setHeightFromTop(newHeightFromTop);
            heightFromTop && setShowWalletsCarouselHeader(heightFromTop < -100);
        }
    }, [heightFromTop]);

    //this handle scroll function listens to the scroll as well as touchmove events to handle drag scrolling on mobile
    useEventListener('touchmove', handleScroll, containerRef);
    useEventListener('touchend', handleScroll, containerRef);
    useEventListener('scroll', handleScroll, containerRef);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            handleScroll();
        }

        return () => {
            isMounted = false;
        };
    }, [handleScroll, heightFromTop]);

    return (
        <React.Fragment>
            {!isActiveWalletLoading && (
                <WalletsCarouselHeader
                    balance={activeWallet?.display_balance}
                    currency={activeWallet?.currency || 'USD'}
                    hidden={!showWalletsCarouselHeader}
                    isDemo={activeWallet?.is_virtual}
                />
            )}
            <div className='wallets-carousel' ref={containerRef}>
                <WalletsCarouselContent onWalletSettled={setIsWalletSettled} />
                <AccountsList isWalletSettled={isWalletSettled} />
            </div>
        </React.Fragment>
    );
};

export default WalletsCarousel;
