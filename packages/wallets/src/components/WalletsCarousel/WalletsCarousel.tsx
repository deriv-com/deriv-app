import React, { useEffect, useRef, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { TSubscribedBalance } from '../../types';
import { AccountsList } from '../AccountsList';
import { WalletsCarouselContent } from '../WalletsCarouselContent';
import { WalletsCarouselHeader } from '../WalletsCarouselHeader';
import './WalletsCarousel.scss';

const WalletsCarousel: React.FC<TSubscribedBalance> = ({ balance }) => {
    const { data: activeWallet, isInitializing: isActiveWalletInitializing } = useActiveWalletAccount();
    const [hideWalletsCarouselHeader, setHideWalletsCarouselHeader] = useState(true);
    const contentRef = useRef(null);

    const { data: balanceData, isLoading: isBalanceLoading } = balance;
    const showLoader = isBalanceLoading || isActiveWalletInitializing;

    const displayedBalance = () => {
        return displayMoney?.(
            balanceData?.accounts?.[activeWallet?.loginid ?? '']?.balance ?? 0,
            activeWallet?.currency || '',
            {
                fractional_digits: activeWallet?.currency_config?.fractional_digits,
            }
        );
    };

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
        <div className='wallets-carousel'>
            <div className='wallets-carousel__header'>
                {!showLoader && (
                    <WalletsCarouselHeader
                        balance={displayedBalance as unknown as string}
                        currency={activeWallet?.currency || 'USD'}
                        hidden={hideWalletsCarouselHeader}
                        isDemo={activeWallet?.is_virtual}
                    />
                )}
                <div ref={contentRef}>
                    <WalletsCarouselContent />
                </div>
            </div>
            <AccountsList />
        </div>
    );
};

export default WalletsCarousel;
