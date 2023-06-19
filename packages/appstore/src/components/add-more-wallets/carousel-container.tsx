import React from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import { PrevButton, NextButton } from './carousel-buttons';

const CarouselContainer = ({ children }: JSX.Element) => {
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
        watchDrag: false,
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(options);
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
        <div className='add-wallets__content'>
            <div className='add-wallets__viewport' ref={emblaRef}>
                <div className='add-wallets__container'>{children}</div>
            </div>
            <PrevButton enabled={prev_btn_disabled} onClick={scrollPrev} />
            <NextButton enabled={next_btn_disabled} onClick={scrollNext} />
        </div>
    );
};

export default CarouselContainer;
