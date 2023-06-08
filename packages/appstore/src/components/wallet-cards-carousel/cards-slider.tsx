import React from 'react';
import { ProgressBarOnboarding, WalletCard } from '@deriv/components';
import { TWalletAccount } from 'Types';
import { formatMoney } from '@deriv/shared';
import Slider from 'react-slick';

type TProps = {
    readonly items: TWalletAccount[];
    setActivePage: React.Dispatch<React.SetStateAction<number>>;
};

const CardsSlider = React.memo(({ items, setActivePage }: TProps) => {
    const slider_ref = React.useRef<Slider | null>(null);

    const handlerGoTo = (slideNumber: number) => {
        setActivePage(slideNumber - 1);
        slider_ref?.current?.slickGoTo(slideNumber - 1);
    };

    const settings = {
        dots: true,
        infinite: false,
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        variableWidth: true,
        arrows: false,
        speed: 500,
        touchThreshold: 10,
        dotsClass: 'wallet-cards-carousel__pagination',
        afterChange: (currentSlide: number) => {
            setActivePage(currentSlide);
        },
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
        <Slider {...settings} ref={slider_ref}>
            {items.map((item: TWalletAccount) => (
                <WalletCard
                    key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                    wallet={{
                        ...item,
                        balance: formatMoney(item.currency, item.balance, true),
                        jurisdiction_title: item.landing_company_shortcode,
                    }}
                    size='medium'
                />
            ))}
        </Slider>
    );
});
CardsSlider.displayName = 'CardsSlider';

export default CardsSlider;
