import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel, { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel-react';

const AddMoreWalletsCarousel = () => {
    const is_mobile = true;
    const data = [
        {
            text: 'BTC',
            background: 'lightblue',
        },
        {
            text: 'ETH',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
        {
            text: 'USDT',
            background: 'lightblue',
        },
    ];
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
        watchDrag: is_mobile,
    };

    const [AddMoreWalletsCarouselRef, emblaApi] = useEmblaCarousel(options);
    const [is_hovered, setIsHovered] = useState(is_mobile);
    const [prev_btn_enabled, setPrevBtnEnabled] = useState(false);
    const [next_btn_enabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback((embla_api: EmblaCarouselType) => {
        setPrevBtnEnabled(embla_api.canScrollPrev());
        setNextBtnEnabled(embla_api.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <React.Fragment>
            <div className='add-wallets'>
                <h2 className='add-wallets__header'>Add more Wallets</h2>
                <div
                    className='add-wallets__carousel'
                    data-testid='dt-add-wallets'
                    ref={AddMoreWalletsCarouselRef}
                    onMouseEnter={() => !is_mobile && setIsHovered(true)}
                    onMouseLeave={() => !is_mobile && setIsHovered(false)}
                >
                    <div className='add-wallets__carousel-wrapper'>
                        {data.map(item => (
                            <div
                                className='add-wallets__card'
                                style={{ backgroundColor: item.background }}
                                key={item.text}
                            >
                                {item.text}
                            </div>
                        ))}
                    </div>
                    {!is_mobile && is_hovered && (
                        <React.Fragment>
                            <button
                                className='add-wallets__carousel-btn add-wallets__carousel-btn--prev'
                                onClick={scrollPrev}
                                disabled={!prev_btn_enabled}
                            >
                                a
                            </button>
                            <button
                                className='add-wallets__carousel-btn add-wallets__carousel-btn--next'
                                onClick={scrollNext}
                                disabled={!next_btn_enabled}
                            >
                                b
                            </button>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default AddMoreWalletsCarousel;
