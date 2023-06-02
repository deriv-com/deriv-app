import React from 'react';
import classNames from 'classnames';
import { useWalletCardCarousel } from './useCarousel';
import { ProgressBarOnboarding, Icon, Text, WalletCard } from '@deriv/components';
import { getWalletHeaderButtons } from 'Constants/utils';
import { TWalletAccount } from 'Types';
import Slider from 'react-slick';
import './wallet-cards-carousel.scss';

interface WalletCardsCarouselProps {
    readonly items: TWalletAccount[];
}

// export const WalletCardsCarousel = ({ items }: WalletCardsCarouselProps) => {
//     const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

//     const wallet_btns = getWalletHeaderButtons(items[activePageIndex]?.is_virtual);

//     /*
// const settings = {
//       // className: 'center',
//       centerMode: true,
//       infinite: false,
//       centerPadding: '60px',
//       slidesToShow: 1,
//       speed: 500,
//       dots: true,
//       arrows: false,
//     };
//     return (
//       <div>
//         <h2>Center Mode</h2>
//         <Slider {...settings}>
//           <div>
//             <h3>1</h3>
//           </div>
//           <div>
//             <h3>2</h3>
//           </div>
//           <div>
//             <h3>3</h3>
//           </div>
//           <div>
//             <h3>4</h3>
//           </div>
//           <div>
//             <h3>5</h3>
//           </div>
//           <div>
//             <h3>6</h3>
//           </div>
//         </Slider>
//       </div>
//     );
//     */

//     const walletsJSX = React.useMemo(
//         () =>
//             items.map((item, i) => (
//                 <li
//                     key={i}
//                     className={classNames('wallet-cards-carousel__item', {
//                         'wallet-cards-carousel__item--first': i === 0,
//                         'wallet-cards-carousel__item--last': i === pages.length - 1,
//                     })}
//                 >
//                     <WalletCard
//                         key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
//                         wallet={{ ...item, jurisdiction_title: item.landing_company_shortcode }}
//                         size='medium'
//                     />
//                 </li>
//             )),
//         [items, pages.length]
//     );

//     return (
//         <div className='wallet-cards-carousel'>
//             <ul className='wallet-cards-carousel__scroll' ref={scrollRef}>
//                 {walletsJSX}
//             </ul>
//             <div className='wallet-cards-carousel__pagination'>
//                 <ProgressBarOnboarding
//                     step={activePageIndex + 1}
//                     amount_of_steps={pages}
//                     setStep={goTo}
//                     is_transition={true}
//                 />
//             </div>
//             <div className='wallet-cards-carousel__buttons'>
//                 {wallet_btns.map(btn => (
//                     <div key={btn.name} className='wallet-cards-carousel__buttons-item' onClick={btn.action}>
//                         <div className='wallet-cards-carousel__buttons-item-icon'>
//                             <Icon icon={btn.icon} />
//                         </div>
//                         <Text size='xxxxs' className='wallet-cards-carousel__buttons-item-text'>
//                             {btn.text}
//                         </Text>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

export const WalletCardsCarousel = ({ items }: WalletCardsCarouselProps) => {
    // const { scrollRef, activePageIndex, goTo, pages } = useWalletCardCarousel();

    // const wallet_btns = getWalletHeaderButtons(items[activePageIndex]?.is_virtual);
    const wallet_btns = getWalletHeaderButtons(false);

    const settings = {
        // className: 'center',
        // className: 'wallet-cards-carousel__scroll',
        // className: 'slider variable-width',
        // centerMode: true,
        // infinite: false,
        // centerPadding: '2.4rem',
        // slidesToShow: 1,
        // slidesToScroll: 1,
        // speed: 500,
        // // dots: true,
        // arrows: true,
        // variableWidth: true,

        className: 'slider variable-width',
        dots: true,
        infinite: false,
        centerMode: true,
        centerPadding: '2.4rem',
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: true,
        arrow: false,
    };

    const walletsJSX = React.useMemo(
        () =>
            items.map((item, i) => (
                // <div
                //     key={i}
                //     // className={classNames('wallet-cards-carousel__item', {
                //     //     'wallet-cards-carousel__item--first': i === 0,
                //     //     'wallet-cards-carousel__item--last': i === pages.length - 1,
                //     // })}
                // >
                <WalletCard
                    key={`${item.name} ${item.currency} ${item.landing_company_shortcode}`}
                    wallet={{ ...item, jurisdiction_title: item.landing_company_shortcode }}
                    size='medium'
                />
                // </div>
            )),
        [items]
    );

    return (
        <div>
            <Slider {...settings}>{walletsJSX}</Slider>
        </div>
    );
};

export default WalletCardsCarousel;
