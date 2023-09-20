import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import { useAvailableWallets } from '@deriv/api';
import useDevice from '../../hooks/useDevice';
import WalletsAddMoreCard from '../WalletsAddMoreCard';

const WalletsAddMoreCarousel = () => {
    const { is_mobile } = useDevice();
    const { data: available_wallets } = useAvailableWallets();
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
    };

    const [wallets_add_more_embla_ref, wallets_add_more_embla_api] = useEmblaCarousel(options);
    const [is_hovered, setIsHovered] = useState(is_mobile);
    const [prev_btn_enabled, setPrevBtnEnabled] = useState(false);
    const [next_btn_enabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => wallets_add_more_embla_api?.scrollPrev(), [wallets_add_more_embla_api]);
    const scrollNext = useCallback(() => wallets_add_more_embla_api?.scrollNext(), [wallets_add_more_embla_api]);

    useEffect(() => {
        if (!wallets_add_more_embla_api) return;

        const onSelect = (embla_api: EmblaCarouselType) => {
            setPrevBtnEnabled(embla_api.canScrollPrev());
            setNextBtnEnabled(embla_api.canScrollNext());
        };

        onSelect(wallets_add_more_embla_api);
        wallets_add_more_embla_api.on('reInit', onSelect);
        wallets_add_more_embla_api.reInit({ watchDrag: is_mobile });
        wallets_add_more_embla_api.on('select', onSelect);
    }, [wallets_add_more_embla_api, is_mobile]);

    if (!available_wallets?.length) return <h1>No wallets found</h1>;
    return (
        <React.Fragment>
            <div className='wallets-add-more'>
                <h2 className='wallets-add-more__header'>Add more Wallets</h2>
                <div
                    className='wallets-add-more__carousel'
                    data-testid='dt-wallets-add-more'
                    ref={wallets_add_more_embla_ref}
                    onMouseEnter={() => !is_mobile && setIsHovered(true)}
                    onMouseLeave={() => !is_mobile && setIsHovered(false)}
                >
                    <div className='wallets-add-more__carousel-wrapper'>
                        {available_wallets?.map(item => {
                            const { currency, is_added, landing_company_name } = item;
                            return (
                                <WalletsAddMoreCard
                                    key={`wallets_add_more_${currency}-${landing_company_name}`}
                                    currency={currency}
                                    is_added={is_added}
                                    landing_company_name={landing_company_name}
                                />
                            );
                        })}
                    </div>
                    {!is_mobile && is_hovered && (
                        <React.Fragment>
                            <button
                                className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--prev'
                                onClick={scrollPrev}
                                disabled={!prev_btn_enabled}
                            >
                                &lt;
                            </button>
                            <button
                                className='wallets-add-more__carousel-btn wallets-add-more__carousel-btn--next'
                                onClick={scrollNext}
                                disabled={!next_btn_enabled}
                            >
                                &gt;
                            </button>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default WalletsAddMoreCarousel;
