import React from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import CFDCompareAccountsCarouselButton from './cfd-compare-accounts-carousel-button';

type TCFDCompareAccountsCarousel = {
    children: React.ReactNode;
};

const CFDCompareAccountsCarousel = (props: TCFDCompareAccountsCarousel) => {
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [prev_btn_enabled, setPrevBtnEnabled] = React.useState(false);
    const [next_btn_enabled, setNextBtnEnabled] = React.useState(false);

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
        <div className='cfd-compare-accounts-carousel'>
            <div className='cfd-compare-accounts-carousel__viewport' ref={emblaRef}>
                <div className='cfd-compare-accounts-carousel__container'>{props.children}</div>
            </div>
            <CFDCompareAccountsCarouselButton onClick={scrollPrev} isNext={false} enabled={prev_btn_enabled} />
            <CFDCompareAccountsCarouselButton onClick={scrollNext} isNext={true} enabled={next_btn_enabled} />
        </div>
    );
};

export default CFDCompareAccountsCarousel;
