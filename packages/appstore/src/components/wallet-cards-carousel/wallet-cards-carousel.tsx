import React from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import classNames from 'classnames';
import './wallet-cards-carousel.scss';

interface WalletCardsCarouselProps<T> {
    readonly items: T[];
}

const WalletCardsCarousel = React.memo(<T,>({ items }: WalletCardsCarouselProps<T>) => {
    const initial_pages = items.map((item, index) => [index]);
    const { scrollRef, snapPointIndexes } = useSnapCarousel({
        axis: 'x',
        initialPages: initial_pages,
    });

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item: any, i) => (
                    <WalletCardsCarouselItem
                        key={item.id}
                        className={classNames('wallet-cards-carousel__item', {
                            'wallet-cards-carousel__item--snap-point': snapPointIndexes.has(i),
                            'wallet-cards-carousel__item--first': i === 0,
                            'wallet-cards-carousel__item--last': i === initial_pages.length - 1,
                        })}
                    >
                        <img src={item.src} width='160px' height='96px' style={{ borderRadius: '4px' }} />
                    </WalletCardsCarouselItem>
                ))}
            </ul>
        </div>
    );
});
WalletCardsCarousel.displayName = 'WalletCardsCarousel';

interface WalletCardsCarouselItemProps {
    readonly className?: string;
    readonly children?: React.ReactNode;
}

export const WalletCardsCarouselItem = ({ className, children }: WalletCardsCarouselItemProps) => (
    <li className={className || ''}>{children}</li>
);

export default WalletCardsCarousel;
