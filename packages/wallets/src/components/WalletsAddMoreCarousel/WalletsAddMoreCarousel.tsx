import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useHover } from 'usehooks-ts';
import { useAvailableWallets } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { IconButton, WalletText } from '../Base';
import { WalletsAddMoreLoader } from '../SkeletonLoader';
import WalletsAddMoreCard from '../WalletsAddMoreCard';
import './WalletsAddMoreCarousel.scss';

const WalletsAddMoreCarousel: React.FC = () => {
    const { isDesktop, isMobile } = useDevice();
    const { data: availableWallets, isLoading } = useAvailableWallets();
    const [walletsAddMoreEmblaRef, walletsAddMoreEmblaAPI] = useEmblaCarousel({
        align: 0,
        containScroll: 'trimSnaps',
    });
    const hoverRef = useRef<HTMLDivElement>(null);
    const isHover = useHover(hoverRef);

    useEffect(() => {
        if (!walletsAddMoreEmblaAPI) return;

        walletsAddMoreEmblaAPI.reInit({ watchDrag: isMobile });
    }, [walletsAddMoreEmblaAPI, isMobile]);

    return (
        <div className='wallets-add-more' ref={hoverRef}>
            <div className='wallets-add-more__header'>
                <WalletText size='2xl' weight='bold'>
                    Add more Wallets
                </WalletText>
            </div>
            <div className='wallets-add-more__carousel' data-testid='dt-wallets-add-more' ref={walletsAddMoreEmblaRef}>
                <div className='wallets-add-more__carousel-wrapper'>
                    {isLoading &&
                        Array.from({ length: 8 }).map((_, idx) => (
                            <WalletsAddMoreLoader key={`wallets-add-more-loader-${idx}`} />
                        ))}
                    {availableWallets?.map(wallet => (
                        <WalletsAddMoreCard
                            currency={wallet.currency}
                            is_added={wallet.is_added}
                            key={`wallets_add_more_${wallet.currency}-${wallet.landing_company_name}`}
                            landing_company_name={wallet.landing_company_name}
                        />
                    ))}
                </div>
                {isDesktop && isHover && (
                    <React.Fragment>
                        <div className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'>
                            <IconButton
                                color='white'
                                disabled={!walletsAddMoreEmblaAPI?.canScrollPrev()}
                                icon='&lt;'
                                isRound
                                onClick={() => walletsAddMoreEmblaAPI?.scrollPrev()}
                                size='lg'
                            />
                        </div>
                        <div className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'>
                            <IconButton
                                color='white'
                                disabled={!walletsAddMoreEmblaAPI?.canScrollNext()}
                                icon='&gt;'
                                isRound
                                onClick={() => walletsAddMoreEmblaAPI?.scrollNext()}
                                size='lg'
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default WalletsAddMoreCarousel;
