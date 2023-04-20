import React from 'react';
import AUDBg from 'Assets/svgs/wallets/aud-bg.svg';
import AUDBgDark from 'Assets/svgs/wallets/aud-bg-dark.svg';
import AUDCurrency from 'Assets/svgs/wallets/aud-currency.svg';
import EURCurrency from 'Assets/svgs/wallets/eur-currency.svg';
import USDCurrency from 'Assets/svgs/wallets/usd-currency.svg';
// import AUDBg from 'react-svg-loader!./aud-bg.svg';
// import AUDBgDark from 'react-svg-loader!./aud-bg-dark.svg';
// import AUDCurrency from 'react-svg-loader!./aud-currency.svg';
// import EURCurrency from 'react-svg-loader!./eur-currency.svg';
// import USDCurrency from 'react-svg-loader!./usd-currency.svg';
import { TImageTestID, TWalletsImagesListKeys, WalletsImageProps } from '../image-types';
// import { getUrlBase } from '@deriv/shared';

export const WalletsImagesList = {
    aud_currency: AUDCurrency,
    eur_currency: EURCurrency,
    usd_currency: USDCurrency,

    aud_bg: AUDBg,
    aud_bg_dark: AUDBgDark,
} as const;

const WalletsImage = ({ image, className, width }: WalletsImageProps<TWalletsImagesListKeys>) => {
    const Component = WalletsImagesList[image] as React.ElementType;
    const data_testid: TImageTestID = `dt_${image}`;
    // const ref2 = React.useRef(null);

    // return (
    //     <Component
    //         // width={e => WHandler(e)}
    //         className={className}
    //         // style={{ transform: `scale(${width})`, height: width ? 80 : '', width: width ? 128 : '' }}
    //         style={{ width, height: width }}
    //         data-testid={data_testid}
    //         ref={ref}
    //     />
    // );
    return <Component className={className} style={{ width }} data-testid={data_testid} />;

    // return (
    //     <svg
    //         xmlns='http://www.w3.org/2000/svg'
    //         xmlnsXlink='http://www.w3.org/1999/xlink'
    //         className='dc-icon'
    //         // className={classNames('dc-icon', className, {
    //         //     'dc-icon--active': color === 'active',
    //         //     'dc-icon--disabled': color === 'disabled',
    //         //     'dc-icon--green': color === 'green' || icon === 'IcProfit',
    //         //     'dc-icon--red': color === 'red' || icon === 'IcLoss',
    //         //     'dc-icon--secondary': color === 'secondary',
    //         //     'dc-icon--brand': color === 'brand',
    //         //     'dc-icon--black': color === 'black',
    //         //     'dc-icon--orange': color === 'orange',
    //         // })}
    //         // data-testid={data_testid}
    //         // height={100}
    //         // id={id}
    //         // width={100}
    //         // onClick={onClick}
    //         // onMouseDown={onMouseDown}
    //         // onMouseEnter={onMouseEnter}
    //         // onMouseLeave={onMouseLeave}
    //         // onTouchStart={onTouchStart}
    //         // ref={ref}
    //         // style={
    //         //     (custom_color
    //         //         ? {
    //         //               '--fill-color1': custom_color,
    //         //           }
    //         //         : undefined) as React.CSSProperties & { '--fill-color1': string }
    //         // }
    //     >
    //         {/* <use xlinkHref={`${getUrlBase(`/public/sprites/${filename}.svg`)}#${sprite_id}`} /> */}
    //         {/* <use xlinkHref={USDCurrency} /> */}
    //         {/* {WalletsImagesList[image]} */}
    //         <Component className={className} style={{ transform: `scale(${width})` }} data-testid={data_testid} />
    //     </svg>
    // );
};
WalletsImage.displayName = 'WalletsImage';

export default WalletsImage;
