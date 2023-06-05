import React from 'react';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon, Text, WalletCard } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import Slider from 'react-slick';
import './wallet-cards-carousel.scss';
import './slick.scss';
import './slick-theme.scss';

interface WalletCardsCarouselProps {
    readonly items: TWalletAccount[];
}

export const WalletCardsCarouselOwn = ({ items }: WalletCardsCarouselProps) => {
    const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

    const wallet_btns = getWalletHeaderButtons(items[activePageIndex]?.is_virtual);

    const walletsJSX = React.useMemo(
        () =>
            items.map((item, i) => (
                <li
                    key={i}
                    className={classNames('wallet-cards-carousel__item', {
                        'wallet-cards-carousel__item--first': i === 0,
                        'wallet-cards-carousel__item--last': i === pages.length - 1,
                    })}
                >
                    <WalletCard
                        key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                        wallet={{ ...item, jurisdiction_title: item.landing_company_shortcode }}
                        size='medium'
                    />
                </li>
            )),
        [items, pages.length]
    );

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {walletsJSX}
            </ul>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding
                    step={activePageIndex + 1}
                    amount_of_steps={pages}
                    setStep={goTo}
                    is_transition={true}
                />
            </div>
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
};

export const WalletCardsCarousel = React.memo(({ items }: WalletCardsCarouselProps) => {
    const [activePage, setActivePage] = React.useState(0);

    const wallet_btns = getWalletHeaderButtons(items[activePage]?.is_virtual);

    const sliderJSX = React.useMemo(() => {
        const settings = {
            className: 'wallet-cards-carousel',
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
            // (dots: ReactNode) => Elemen
            appendDots: (dots: React.ReactElement[]) => {
                const active = dots.findIndex(dot => dot.props.className === 'slick-active') || 0;

                setActivePage(active);

                return (
                    <div>
                        <ProgressBarOnboarding
                            step={active + 1}
                            amount_of_steps={dots}
                            is_transition={true}
                            // setStep={setActivePage}
                        />
                    </div>
                );
            },
        };

        return (
            <Slider {...settings}>
                {items.map((item, i) => (
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
        <div>
            <div>{sliderJSX}</div>
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
