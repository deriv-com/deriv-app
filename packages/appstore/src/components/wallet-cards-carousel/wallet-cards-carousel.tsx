import React from 'react';
import { useSnapCarousel } from 'react-snap-carousel';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import './wallet-cards-carousel.scss';
import './styles.scss';
import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';

interface WalletCardsCarouselProps<T> {
    readonly items: T[];
}

export const WalletCardsCarouselMyOwnImplementation = <T,>({ items }: WalletCardsCarouselProps<T>) => {
    // const initial_pages = items.map((item, index) => [index]);
    const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

    // const { scrollRef, activePageIndex, pages, goTo, snapPointIndexes } = useSnapCarousel({});

    // console.log('OWN activePageIndex = ', activePageIndex, ', pages = ', pages);

    const wallet_btns = getWalletHeaderButtons(activePageIndex % 2 === 0);

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item: any, i) => (
                    <WalletCardsCarouselItem
                        key={item.id}
                        className={classNames('wallet-cards-carousel__item wallet-cards-carousel__item--snap-point', {
                            'wallet-cards-carousel__item--first': i === 0,
                            'wallet-cards-carousel__item--last': i === pages.length - 1,
                        })}
                    >
                        <img src={item.src} width='160px' height='96px' style={{ borderRadius: '4px' }} />
                    </WalletCardsCarouselItem>
                ))}
            </ul>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding step={activePageIndex} amount_of_steps={pages} setStep={goTo} />
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

const WalletCardsCarousel = <T,>({ items }: WalletCardsCarouselProps<T>) => {
    const initial_pages = items.map((item, index) => [index]);
    const { scrollRef, activePageIndex, goTo, snapPointIndexes } = useSnapCarousel({
        axis: 'x',
        initialPages: initial_pages,
    });

    // const { scrollRef, activePageIndex, pages, goTo, snapPointIndexes } = useSnapCarousel({});

    // console.log('activePageIndex_ = ', activePageIndex);

    const wallet_btns = getWalletHeaderButtons(activePageIndex % 2 === 0);

    return (
        <div className='wallet-cards-carousel'>
            <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
                {items.map((item: any, i) => (
                    <WalletCardsCarouselItem
                        key={item.id}
                        className={classNames('wallet-cards-carousel__item', {
                            'wallet-cards-carousel__item--snap-point': snapPointIndexes.has(i),
                            // 'wallet-cards-carousel__item--snap-point': true,
                            'wallet-cards-carousel__item--first': i === 0,
                            'wallet-cards-carousel__item--last': i === initial_pages.length - 1,
                        })}
                    >
                        <img src={item.src} width='160px' height='96px' style={{ borderRadius: '4px' }} />
                    </WalletCardsCarouselItem>
                ))}
            </ul>
            <div className='wallet-cards-carousel__pagination'>
                <ProgressBarOnboarding step={activePageIndex} amount_of_steps={initial_pages} setStep={goTo} />
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
WalletCardsCarousel.displayName = 'WalletCardsCarousel';

interface WalletCardsCarouselItemProps {
    readonly className?: string;
    readonly children?: React.ReactNode;
}

export const WalletCardsCarouselItem = ({ className, children }: WalletCardsCarouselItemProps) => (
    <li className={className || ''}>{children}</li>
);

export const NewCarousel = () => {
    return (
        <Carousel
            additionalTransfrom={0}
            // arrows
            autoPlaySpeed={3000}
            centerMode
            className=''
            containerClass='container'
            dotListClass=''
            draggable
            focusOnSelect={false}
            // infinite
            itemClass=''
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
                desktop: {
                    breakpoint: {
                        max: 3000,
                        min: 1024,
                    },
                    items: 3,
                    partialVisibilityGutter: 40,
                },
                mobile: {
                    breakpoint: {
                        max: 464,
                        min: 0,
                    },
                    items: 1,
                    partialVisibilityGutter: 30,
                },
                tablet: {
                    breakpoint: {
                        max: 1024,
                        min: 464,
                    },
                    items: 2,
                    partialVisibilityGutter: 30,
                },
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=''
            slidesToSlide={1}
            swipeable
        >
            <WithStyles
                description='Fixing CSS load order/style.chunk.css incorrect in Nextjs'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1549989476-69a92fa57c36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='Appending currency sign to a purchase form in your e-commerce site using plain JavaScript.'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 1'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='Appending currency sign to a purchase form in your e-commerce site using plain JavaScript.'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 1'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 1'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550223640-23097fc71cb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='Fixing CSS load order/style.chunk.css incorrect in Nextjs'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550353175-a3611868086b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 1'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550330039-a54e15ed9d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='Appending currency sign to a purchase form in your e-commerce site using plain JavaScript.'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1549737328-8b9f3252b927?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='Fixing CSS load order/style.chunk.css incorrect in Nextjs'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1549833284-6a7df91c1f65?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 1'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1549985908-597a09ef0a7c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
            <WithStyles
                description='React Carousel with Server Side Rendering Support – Part 2'
                headline='w3js.com - web front-end studio'
                image='https://images.unsplash.com/photo-1550064824-8f993041ffd3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
            />
        </Carousel>
    );
};

const WithStyles = ({ description, headline, image }: any) => {
    return <img src={image} width={160} height={96} />;
};

export default WalletCardsCarousel;
