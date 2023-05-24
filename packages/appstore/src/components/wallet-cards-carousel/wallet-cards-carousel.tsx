import React from 'react';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-cards-carousel.scss';

interface WalletCardsCarouselProps<T> {
    readonly items: T[];
}

export const WalletCardsCarousel = <T,>({ items }: WalletCardsCarouselProps<T>) => {
    const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

    const wallet_btns = getWalletHeaderButtons(activePageIndex % 2 === 0);

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item: any, i) => (
                    <WalletCardsCarouselItem
                        key={item.id}
                        className={classNames('wallet-cards-carousel__item', {
                            'wallet-cards-carousel__item--first': i === 0,
                            'wallet-cards-carousel__item--last': i === pages.length - 1,
                        })}
                    >
                        <img src={item.src} width='160px' height='96px' style={{ borderRadius: '4px' }} />
                    </WalletCardsCarouselItem>
                ))}
            </ul>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding step={activePageIndex + 1} amount_of_steps={pages} setStep={goTo} />
            </div>
            <div className='wallet-cards-carousel__buttons'>
                {wallet_btns.map(btn => (
                    <div key={btn.name} className='wallet-cards-carousel__buttons-item' onClick={btn.action}>
                        <Icon icon={btn.icon} />
                    </div>
                ))}
            </div>
        </div>
    );
};

interface WalletCardsCarouselItemProps {
    readonly className?: string;
    readonly children?: React.ReactNode;
}

export const WalletCardsCarouselItem = ({ className, children }: WalletCardsCarouselItemProps) => (
    <li className={className || ''}>{children}</li>
);

export default WalletCardsCarousel;
