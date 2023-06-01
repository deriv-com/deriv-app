import React from 'react';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon, Text, WalletCard } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-cards-carousel.scss';
import { TWalletAccount } from 'Types';

interface WalletCardsCarouselProps {
    readonly items: TWalletAccount[];
}

export const WalletCardsCarousel = ({ items }: WalletCardsCarouselProps) => {
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

export default WalletCardsCarousel;
