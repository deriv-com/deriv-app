// import { localize } from '@deriv/translations';
import { Icon } from '@deriv/components';
import { TWalletsImagesListKeys } from 'Assets/svgs/image-types';
import TradingPlatformIcon from 'Assets/svgs/trading-platform';
import WalletsImage from 'Assets/svgs/wallets';
import React from 'react';

type TWalletHeaderCommon = {
    balance?: number;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    jurisdiction: 'virtual';
    currency?: never;
};

type TWalletHeaderNotDemo = TWalletHeaderCommon & {
    jurisdiction: 'svg' | 'malta';
    currency: 'USD' | 'EUR' | 'AUD';
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderNotDemo;

const WalletHeader = React.memo(({ balance = 0, currency = 'USD', jurisdiction = 'svg' }: TWalletHeader) => {
    // const currency_lowercase: Lowercase<TWalletHeaderNotDemo['currency']> = currency.toLowerCase();
    const currency_lowercase = currency.toLowerCase() as Lowercase<TWalletHeaderNotDemo['currency']>;
    const image_currency: TWalletsImagesListKeys = `${currency_lowercase}_currency`;
    const image_bg: TWalletsImagesListKeys = 'aud_bg';

    return (
        <div className='wallet-header'>
            <WalletsImage image={image_bg} />
            <WalletsImage image={image_bg} width={2} />
            <WalletsImage image={image_bg} width={3} />
            {/* <WalletsImage image={image_bg} width={3} /> */}
            <WalletsImage image={image_currency} />
            {/* <h1>I am a wallet header. Balance = {balance}</h1>
            <p>
                Currency: {currency}, jurisdiction: {jurisdiction}
            </p> */}
            {/* <TradingPlatformIcon icon='Demo' />
            <TradingPlatformIcon icon='Demo' size={32} />
            <TradingPlatformIcon icon='Demo' size={64} />
            <TradingPlatformIcon icon='Demo' size={128} /> */}
            <Icon icon='IcMt5CfdPlatform' size={32} />
            {/* <Icon icon='IcMt5CfdPlatform' size={64} />; */}
            {/* <Icon icon='IcMt5CfdPlatform' size={128} />; */}
            {/* <Icon icon='IcMt5CfdPlatform' size={256} />; */}
        </div>
    );
});

WalletHeader.displayName = 'WalletHeader';
export default WalletHeader;
