import React, { useEffect, useRef, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC = () => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);
    const [isContentScrolled, setIsContentScrolled] = useState(false);
    const [heightFromTop, setHeightFromTop] = useState(0);
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        const currentContainerRef = containerRef.current;

        const handleScroll = () => {
            if (currentContainerRef) {
                const newHeightFromTop = currentContainerRef.getBoundingClientRect().top;
                setHeightFromTop(newHeightFromTop);
                heightFromTop && setIsContentScrolled(heightFromTop < -100);
            }
        };

        if (isMounted) {
            currentContainerRef?.addEventListener('touchmove', handleScroll);
            currentContainerRef?.addEventListener('scroll', handleScroll);
            handleScroll();
        }

        return () => {
            currentContainerRef?.removeEventListener('touchmove', handleScroll);
            currentContainerRef?.removeEventListener('scroll', handleScroll);
            isMounted = false;
        };
    }, [heightFromTop]);

    return (
        <React.Fragment>
            {!isActiveWalletLoading && (
                <WalletsCarouselHeader
                    balance={activeWallet?.display_balance}
                    currency={activeWallet?.currency || 'USD'}
                    hidden={!isContentScrolled}
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
