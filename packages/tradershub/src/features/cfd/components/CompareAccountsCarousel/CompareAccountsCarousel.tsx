import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import CFDCompareAccountsCarouselButton from './CompareAccountsCarouselButton';

const CompareAccountsCarousel = ({ children }: PropsWithChildren) => {
    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
    };
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className='relative overflow-hidden'>
            <div className='w-full h-full overflow-hidden pb-3000' ref={emblaRef}>
                <div className='flex flex-row invisible max-h-screen ease-in-out duration-0 -ml-500 touch-pan-y'>
                    {children}
                </div>
            </div>
            <CFDCompareAccountsCarouselButton enabled={prevBtnEnabled} isNext={false} onClick={scrollPrev} />
            <CFDCompareAccountsCarouselButton enabled={nextBtnEnabled} isNext={true} onClick={scrollNext} />
        </div>
    );
};

export default CompareAccountsCarousel;
