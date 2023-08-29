import React from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import { observer, useStore } from '@deriv/stores';
import { PrevButton, NextButton } from './carousel-buttons';

const CarouselContainer: React.FC<React.PropsWithChildren<unknown>> = observer(({ children }) => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
        watchDrag: is_mobile,
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [is_hovered, setIsHovered] = React.useState(is_mobile);
    const [prev_btn_disabled, setPrevBtnEnabled] = React.useState(false);
    const [next_btn_disabled, setNextBtnEnabled] = React.useState(false);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = React.useCallback((embla_api: EmblaCarouselType) => {
        setPrevBtnEnabled(embla_api.canScrollPrev());
        setNextBtnEnabled(embla_api.canScrollNext());
    }, []);

    React.useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div
            className='add-wallets__content'
            onMouseEnter={() => !is_mobile && setIsHovered(true)}
            onMouseLeave={() => !is_mobile && setIsHovered(false)}
        >
            <div className='carousel' ref={emblaRef}>
                <div className='carousel__wrapper'>{children}</div>
            </div>
            {!is_mobile && is_hovered && (
                <React.Fragment>
                    <PrevButton enabled={prev_btn_disabled} onClick={scrollPrev} />
                    <NextButton enabled={next_btn_disabled} onClick={scrollNext} />
                </React.Fragment>
            )}
        </div>
    );
});

export default CarouselContainer;
