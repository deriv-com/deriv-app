import React, { useEffect, useRef, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { AccountsList } from '../AccountsList';
import { WalletText } from '../Base';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC = () => {
    const [isWalletSettled, setIsWalletSettled] = useState(true);
    const [hideWalletsCarouselHeader, setHideWalletsCarouselHeader] = useState(false);
    const contentRef = useRef(null);
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();

    // useEffect hook to handle event for hiding/displaying WalletsCarouselHeader
    // walletsCarouselHeader will be displayed when WalletsCarouselContent is almost out of viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    setHideWalletsCarouselHeader(entry.isIntersecting);
                });
            },
            { threshold: 0.4 } // triggers when 40% of the element is left in view
        );

        const currentContentRef = contentRef.current;

        if (currentContentRef) {
            observer.observe(currentContentRef);
        }

        return () => {
            if (currentContentRef) {
                observer.unobserve(currentContentRef);
            }
        };
    }, []);

    return (
        <React.Fragment>
            {!isActiveWalletLoading && (
                <WalletsCarouselHeader
                    balance={activeWallet?.display_balance}
                    currency={activeWallet?.currency || 'USD'}
                    hidden={hideWalletsCarouselHeader}
                    isDemo={activeWallet?.is_virtual}
                />
            )}
            <div className='wallets-carousel'>
                <div className='wallets-carousel__header'>
                    <WalletText size='xl' weight='bold'>
                        Trader&apos;s Hub
                    </WalletText>
                </div>
                <div ref={contentRef}>
                    <WalletsCarouselContent onWalletSettled={setIsWalletSettled} />
                </div>
                <AccountsList isWalletSettled={isWalletSettled} />
            </div>
        </React.Fragment>
    );
};

export default WalletsCarousel;
