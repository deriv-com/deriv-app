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
            {/* <WalletsImage image={image_bg} /> */}
            {/* <WalletsImage image={image_currency} /> */}
            <div className='wallet-header__container'>
                <div className='wallet-header__currency'>
                    <Icon icon='IcAppstoreWalletEurLight' width={120} height={80} />
                </div>
                <div className='wallet-header__description'>
                    <div>Title</div>

                    <div className={'wallet-header__description-buttons'}>
                        <div className={'wallet-header__description-buttons-item'}>
                            <Icon icon='IcAppstoreWalletDeposit' />
                        </div>
                        <div className={'wallet-header__description-buttons-item'}>
                            <Icon icon='IcAppstoreWalletWithdraw' />
                        </div>
                        <div className={'wallet-header__description-buttons-item'}>
                            <Icon icon='IcAppstoreWalletTransfer' />
                        </div>
                        <div className={'wallet-header__description-buttons-item'}>
                            <Icon icon='IcAppstoreWalletTransactions' />
                        </div>
                    </div>
                </div>
                <div className='wallet-header__balance'>description</div>
            </div>

            {/* <Icon icon='IcAppstoreAudBg' />
            <Icon icon='IcAppstoreCircle' />
            <Icon icon='IcAppstoreAdd' size={32} />
            <Icon icon='IcAppstoreAudBg' size={128} />
            <Icon icon='IcAppstoreCircle' size={128} />
            <Icon icon='IcAppstoreAdd' size={128} /> */}

            {/* <h1>I am a wallet header. Balance = {balance}</h1>
            <p>
                Currency: {currency}, jurisdiction: {jurisdiction}
            </p> */}

            {/* <TradingPlatformIcon icon='Demo' />
            <TradingPlatformIcon icon='Demo' size={24} />
            <TradingPlatformIcon icon='Demo' size={32} />
            <TradingPlatformIcon icon='Demo' size={64} />
            <TradingPlatformIcon icon='Demo' size={128} /> */}

            {/* <Icon icon='IcMt5CfdPlatform' size={32} /> */}
            {/* <Icon icon='IcMt5CfdPlatform' size={64} />; */}
            {/* <Icon icon='IcMt5CfdPlatform' size={128} />; */}
            {/* <Icon icon='IcMt5CfdPlatform' size={256} />; */}
        </div>
    );
});

WalletHeader.displayName = 'WalletHeader';
export default WalletHeader;
