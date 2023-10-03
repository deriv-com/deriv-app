import React, { useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useHover } from 'usehooks-ts';
import { useAvailableWallets } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import { Loader } from '../Loader';
import WalletsAddMoreCard from '../WalletsAddMoreCard';
import './WalletsAddMoreCarousel.scss';

const WalletsAddMoreCarousel = () => {
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
            <h2 className='wallets-add-more__header'>Add more Wallets</h2>
            <div className='wallets-add-more__carousel' data-testid='dt-wallets-add-more' ref={walletsAddMoreEmblaRef}>
                <div className='wallets-add-more__carousel-wrapper'>
                    {isLoading && <Loader />}
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
                        <button
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'
                            disabled={!walletsAddMoreEmblaAPI?.canScrollPrev()}
                            onClick={() => walletsAddMoreEmblaAPI?.scrollPrev()}
                        >
                            &lt;
                        </button>
                        <button
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'
                            disabled={!walletsAddMoreEmblaAPI?.canScrollNext()}
                            onClick={() => walletsAddMoreEmblaAPI?.scrollNext()}
                        >
                            &gt;
                        </button>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default WalletsAddMoreCarousel;
