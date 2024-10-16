import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import CFDCompareAccountsCarouselButton from './cfd-compare-accounts-carousel-button';

type TCFDCompareAccountsCarousel = {
    children: React.ReactNode;
    isRtl?: boolean;
};

const CFDCompareAccountsCarousel = ({ children, isRtl = false }: TCFDCompareAccountsCarousel) => {
    const options: EmblaOptionsType = {
        align: 'start',
        containScroll: 'trimSnaps',
        direction: isRtl ? 'rtl' : 'ltr',
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
                <div className='cfd-compare-accounts-carousel__container'>{children}</div>
            </div>
            <CFDCompareAccountsCarouselButton onClick={scrollPrev} enabled={prev_btn_enabled} isRtl={isRtl} />
            <CFDCompareAccountsCarouselButton onClick={scrollNext} isNext enabled={next_btn_enabled} isRtl={isRtl} />
        </div>
    );
};

export default CFDCompareAccountsCarousel;
