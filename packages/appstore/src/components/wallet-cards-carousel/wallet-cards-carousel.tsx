import React, { CSSProperties } from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import { ProgressBarOnboarding } from '@deriv/components';
import './wallet-cards-carousel.scss';
import classNames from 'classnames';

interface WalletCardsCarouselProps<T> {
    readonly items: T[];
    // readonly renderItem: (
    //     props: WalletCardsCarouselRenderItemProps<T>
    // ) => React.ReactElement<WalletCardsCarouselItemProps>;
}

interface WalletCardsCarouselRenderItemProps<T> {
    readonly item: T;
    readonly isSnapPoint: boolean;
}

const WalletCardsCarousel = React.memo(<T,>({ items }: WalletCardsCarouselProps<T>) => {
    const { scrollRef, pages, activePageIndex, prev, next, goTo, snapPointIndexes } = useSnapCarousel();

    // const styles = React.useMemo(
    //     () =>
    //         ({
    //             root: {},
    //             scroll: {
    //                 position: 'relative',
    //                 display: 'flex',
    //                 overflow: 'auto',
    //                 scrollSnapType: 'x mandatory',
    //             },
    //             item: {
    //                 width: '160px',
    //                 height: '96px',
    //                 flexShrink: 0,
    //             },
    //             itemSnapPoint: {
    //                 scrollSnapAlign: 'start',
    //             },
    //             controls: {
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //             },
    //             nextPrevButton: {},
    //             nextPrevButtonDisabled: { opacity: 0.3 },
    //             pagination: {
    //                 display: 'flex',
    //             },
    //             paginationButton: {
    //                 margin: '10px',
    //             },
    //             paginationButtonActive: { opacity: 0.3 },
    //             pageIndicator: {
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //             },
    //         } satisfies Record<string, CSSProperties>),
    //     []
    // );

    // const WalletCardsCarouselItem = ({ isSnapPoint, children }: WalletCardsCarouselItemProps) => (
    //     <li
    //         style={{
    //             ...styles.item,
    //             ...(isSnapPoint ? styles.itemSnapPoint : {}),
    //         }}
    //     >
    //         {children}
    //     </li>
    // );

    // console.log('activePageIndex = ', activePageIndex, ', pages = ', pages);

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item: any, i) => (
                    // renderItem({
                    //     item,
                    //     isSnapPoint: snapPointIndexes.has(i),
                    // })
                    <WalletCardsCarouselItem
                        key={item.id}
                        className={classNames('wallet-cards-carousel__item', {
                            'wallet-cards-carousel__item--snap-point': snapPointIndexes.has(i),
                            'wallet-cards-carousel__item--first': i === 0,
                            // 'wallet-cards-carousel__item--last': i === items.length - 1,
                        })}
                    >
                        <img src={item.src} width='160px' height='96px' />
                    </WalletCardsCarouselItem>
                ))}
            </ul>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding step={activePageIndex + 1} amount_of_steps={pages} setStep={goTo} />
            </div>
            {/* <div style={styles.controls} aria-hidden>
                <button
                    style={{
                        ...styles.nextPrevButton,
                        ...(activePageIndex <= 0 ? styles.nextPrevButtonDisabled : {}),
                    }}
                    onClick={() => prev()}
                >
                    Prev
                </button>
                {pages.map((_, i) => (
                    <button
                        key={i}
                        style={{
                            ...styles.paginationButton,
                            ...(activePageIndex === i ? styles.paginationButtonActive : {}),
                        }}
                        onClick={() => goTo(i)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    style={{
                        ...styles.nextPrevButton,
                        ...(activePageIndex === pages.length - 1 ? styles.nextPrevButtonDisabled : {}),
                    }}
                    onClick={() => next()}
                >
                    Next
                </button>
            </div>
            <div style={styles.pageIndicator}>
                {activePageIndex + 1} / {pages.length}
            </div> */}
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
