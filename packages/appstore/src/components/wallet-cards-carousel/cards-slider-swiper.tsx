import React from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { TWalletAccount } from 'Types';
import { WalletCard, ProgressBarOnboarding } from '@deriv/components';
import { formatMoney } from '@deriv/shared';
import 'swiper/css';
import './wallet-cards-carousel.scss';

type TProps = {
    readonly items: TWalletAccount[];
    setActivePage: React.Dispatch<React.SetStateAction<number>>;
};

// TODO: Refactor this component later. Maybe move to package/components
export const CardsSliderSwiper = ({ items, setActivePage }: TProps) => {
    const steps = items.map((_, idx) => idx.toString());
    const swiper_ref = React.useRef<SwiperRef | null>(null);

    const handlerGoTo = React.useCallback(
        (slideNumber: number) => {
            setActivePage(slideNumber);
            swiper_ref?.current?.swiper?.slideTo(slideNumber - 1);
        },
        [setActivePage]
    );

    const swiper_slides = React.useMemo(
        () =>
            items?.map((item: TWalletAccount) => (
                <SwiperSlide
                    style={{ width: 'auto' }}
                    key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                >
                    <WalletCard
                        wallet={{
                            ...item,
                            balance: formatMoney(item.currency, item.balance, true),
                            jurisdiction_title: item.landing_company_shortcode,
                        }}
                        size='medium'
                    />
                </SwiperSlide>
            )),
        [items]
    );

    return (
        <div className='swiper'>
            <Swiper
                ref={swiper_ref}
                slidesPerView={'auto'}
                centeredSlides={true}
                spaceBetween={24}
                onSlideChange={swiperCore => {
                    const { activeIndex } = swiperCore;
                    // console.log({ activeIndex, snapIndex, previousIndex, realIndex });
                    setActivePage(activeIndex);
                }}
            >
                {swiper_slides}
            </Swiper>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding
                    step={swiper_ref?.current?.swiper?.activeIndex ? swiper_ref?.current?.swiper?.activeIndex + 1 : 1}
                    amount_of_steps={steps}
                    is_transition={true}
                    setStep={handlerGoTo}
                />
            </div>
        </div>
    );
};

export default CardsSliderSwiper;
