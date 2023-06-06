import React, { LegacyRef, useRef } from 'react';
import { ProgressBarOnboarding, Icon, Text, WalletCard } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
// import { TWalletAccount } from 'Types';
import Slider from 'react-slick';
import './wallet-cards-carousel.scss';
import './slick.scss';
import './slick-theme.scss';
import { useWalletAccounts } from '@deriv/hooks';

interface WalletCardsCarouselProps {
    readonly items: ReturnType<typeof useWalletAccounts>;
}

export const WalletCardsCarousel = React.memo(({ items }: WalletCardsCarouselProps) => {
    const [activePage, setActivePage] = React.useState(0);
    const ref = useRef(null);

    // console.log('WalletCardsCarousel render, ref = ', ref);

    const wallet_btns = getWalletHeaderButtons(items[activePage]?.is_virtual);

    const sliderJSX = React.useMemo(() => {
        const handlerGoTo = (slideNumber: number) => {
            // super();
            // console.log('handlerGoTo: slideNumber = ', slideNumber);
            setActivePage(slideNumber - 1);
            // if (ref !== null && 'current' in ref && 'slickGoTo' in ref.current) ref.current.slickGoTo(slideNumber - 1);

            (ref?.current as unknown)?.slickGoTo(slideNumber - 1);
        };

        const settings = {
            dots: true,
            infinite: false,
            centerMode: true,
            centerPadding: '0',
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            arrow: false,
            focusOnSelect: true,
            speed: 500,
            touchThreshold: 10,
            dotsClass: 'wallet-cards-carousel__pagination',
            afterChange: (currentSlide: number) => {
                setActivePage(currentSlide);
            },
            // slickGoTo: n => {
            //     console.log('slickGoTo: number = ', n);
            // },
            appendDots: (dots: React.ReactElement[]) => {
                const active = dots.findIndex(dot => dot.props.className === 'slick-active') || 0;
                const steps = dots.map((_, idx) => idx.toString());

                return (
                    <div>
                        <ProgressBarOnboarding
                            step={active + 1}
                            amount_of_steps={steps}
                            is_transition={true}
                            setStep={handlerGoTo}
                        />
                    </div>
                );
            },
        };

        return (
            <Slider {...settings} ref={ref}>
                {items.map(item => (
                    <WalletCard
                        key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                        wallet={{ ...item, jurisdiction_title: item.landing_company_shortcode }}
                        size='medium'
                    />
                ))}
            </Slider>
        );
    }, [items]);

    return (
        <div className='wallet-cards-carousel'>
            {sliderJSX}
            <div className='wallet-cards-carousel__buttons'>
                {wallet_btns.map(btn => (
                    <div key={btn.name} className='wallet-cards-carousel__buttons-item' onClick={btn.action}>
                        <div className='wallet-cards-carousel__buttons-item-icon'>
                            <Icon icon={btn.icon} />
                        </div>
                        <Text size='xxxxs' className='wallet-cards-carousel__buttons-item-text'>
                            {btn.text}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
});
WalletCardsCarousel.displayName = 'WalletCardsCarousel';

export default WalletCardsCarousel;
