import React from 'react';
import useEmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel-react';
import { PrevButton, NextButton } from './carousel-buttons';
import { observer, useStore } from '@deriv/stores';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';

const CarouselContainer: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
    const {
        ui: { is_mobile },
    } = useStore();

    const options: EmblaOptionsType = {
        align: 0,
        containScroll: 'trimSnaps',
        watchDrag: !is_mobile && false,
    };

    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [is_hovered, setIsHovered] = React.useState(false);
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
        <React.Fragment>
            <DesktopWrapper>
                <div
                    className='add-wallets__content'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className='carousel' ref={emblaRef}>
                        <div className='carousel__wrapper'>{children}</div>
                    </div>
                    {is_hovered && <PrevButton enabled={prev_btn_disabled} onClick={scrollPrev} />}
                    {is_hovered && <NextButton enabled={next_btn_disabled} onClick={scrollNext} />}
                </div>
            </DesktopWrapper>
            <MobileWrapper>
                <div className='add-wallets__content'>
                    <div className='carousel' ref={emblaRef}>
                        <div className='carousel__wrapper'>{children}</div>
                    </div>
                    <PrevButton enabled={prev_btn_disabled} onClick={scrollPrev} />
                    <NextButton enabled={next_btn_disabled} onClick={scrollNext} />
                </div>
            </MobileWrapper>
        </React.Fragment>
    );
});

export default CarouselContainer;
