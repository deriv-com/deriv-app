import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useHover } from 'usehooks-ts';
import { useAllWalletAccounts, useAuthorize } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import LeftArrow from '../../public/images/left-arrow.svg';
import RightArrow from '../../public/images/right-arrow.svg';
import { IconButton, WalletText } from '../Base';
import { WalletsAddMoreLoader } from '../SkeletonLoader';
import WalletsAddMoreCard from '../WalletsAddMoreCard';
import './WalletsAddMoreCarousel.scss';

const WalletsAddMoreCarousel: React.FC = () => {
    const { isDesktop, isMobile } = useDevice();
    const { data: wallets, isLoading } = useAllWalletAccounts();
    const { isLoading: isAuthorizeLoading } = useAuthorize();
    const [walletsAddMoreEmblaRef, walletsAddMoreEmblaAPI] = useEmblaCarousel({
        align: 0,
        containScroll: 'trimSnaps',
    });
    const hoverRef = useRef<HTMLDivElement>(null);
    const isHover = useHover(hoverRef);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => walletsAddMoreEmblaAPI?.scrollPrev(), [walletsAddMoreEmblaAPI]);
    const scrollNext = useCallback(() => walletsAddMoreEmblaAPI?.scrollNext(), [walletsAddMoreEmblaAPI]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!walletsAddMoreEmblaAPI) return;

        walletsAddMoreEmblaAPI.reInit({ watchDrag: isMobile });
    }, [walletsAddMoreEmblaAPI, isMobile]);

    useEffect(() => {
        if (!walletsAddMoreEmblaAPI) return;

        onSelect(walletsAddMoreEmblaAPI);
        walletsAddMoreEmblaAPI.on('reInit', onSelect);
        walletsAddMoreEmblaAPI.on('select', onSelect);
    }, [walletsAddMoreEmblaAPI, onSelect]);

    return (
        <div className='wallets-add-more' ref={hoverRef}>
            <div className='wallets-add-more__header'>
                <WalletText size='2xl' weight='bold'>
                    Add more Wallets
                </WalletText>
            </div>
            <div className='wallets-add-more__carousel' data-testid='dt-wallets-add-more' ref={walletsAddMoreEmblaRef}>
                <div className='wallets-add-more__carousel-wrapper' id='wallets_add_more_carousel_wrapper'>
                    {(isLoading || isAuthorizeLoading) &&
                        Array.from({ length: 8 }).map((_, idx) => (
                            <WalletsAddMoreLoader key={`wallets-add-more-loader-${idx}`} />
                        ))}
                    {!(isLoading || isAuthorizeLoading) &&
                        wallets?.map(wallet => (
                            <WalletsAddMoreCard
                                currency={wallet.currency}
                                is_added={wallet.is_added}
                                is_crypto={wallet.is_crypto}
                                key={`wallets_add_more_${wallet.currency}-${wallet.landing_company_name}`}
                                landing_company_name={wallet.landing_company_name}
                            />
                        ))}
                </div>
                {isDesktop && isHover && (
                    <React.Fragment>
                        <IconButton
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'
                            color='white'
                            disabled={!prevBtnEnabled}
                            icon={<LeftArrow />}
                            isRound
                            onClick={scrollPrev}
                            size='lg'
                        />
                        <IconButton
                            className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'
                            color='white'
                            disabled={!nextBtnEnabled}
                            icon={<RightArrow />}
                            isRound
                            onClick={scrollNext}
                            size='lg'
                        />
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default WalletsAddMoreCarousel;
