import React from 'react';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-cards-carousel.scss';

interface WalletCardsCarouselProps<T> {
    readonly items: T[];
}

export const WalletCardsCarousel = <T extends React.ReactNode>({ items }: WalletCardsCarouselProps<T>) => {
    const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

    const wallet_btns = getWalletHeaderButtons(activePageIndex % 2 === 0);

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item, i) => (
                    <WalletCardsCarouselItem
                        key={i}
                        className={classNames('wallet-cards-carousel__item', {
                            'wallet-cards-carousel__item--first': i === 0,
                            'wallet-cards-carousel__item--last': i === pages.length - 1,
                        })}
                    >
                        {item}
                    </WalletCardsCarouselItem>
                ))}
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
    readonly style?: React.CSSProperties;
}

export const WalletCardsCarouselItem = ({ className, children, style }: WalletCardsCarouselItemProps) => (
    <li className={className || ''} style={style}>
        {children}
    </li>
);

export default WalletCardsCarousel;
