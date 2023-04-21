// import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { TWalletsImagesListKeys } from 'Assets/svgs/image-types';
import classNames from 'classnames';
// import TradingPlatformIcon from 'Assets/svgs/trading-platform';
// import WalletsImage from 'Assets/svgs/wallets';
import React from 'react';

type TWalletHeaderCommon = {
    balance?: string;
};

type TWalletHeaderDemo = TWalletHeaderCommon & {
    jurisdiction: 'virtual';
    currency?: never;
};

type TWalletHeaderSvg = TWalletHeaderCommon & {
    jurisdiction: 'svg';
    currency: 'USD' | 'EUR' | 'AUD' | 'BTC' | 'ETH' | 'USDT' | 'eUSDT' | 'tUSDT' | 'LTC' | 'USDC';
};

type TWalletHeaderMalta = TWalletHeaderCommon & {
    jurisdiction: 'malta';
    currency: 'USD' | 'EUR';
};

type TWalletHeader = TWalletHeaderDemo | TWalletHeaderSvg | TWalletHeaderMalta;

const WalletHeader = React.memo(({ balance = '0.00', currency = 'USD', jurisdiction = 'svg' }: TWalletHeader) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // const currency_lowercase: Lowercase<TWalletHeaderNotDemo['currency']> = currency.toLowerCase();
    const currency_lowercase = currency.toLowerCase() as Lowercase<TWalletHeaderSvg['currency']>;
    const image_currency: TWalletsImagesListKeys = `${currency_lowercase}_currency`;
    const image_bg: TWalletsImagesListKeys = 'aud_bg';

    const title_size = 'sm';
    const badge_size = 'xxxs';
    const badge_lh_size = 'xxxs';
    const balance_title_size = 'xxs';
    const balance_amount_size = 'm';
    // const tick_size = isMobile() ? 16 : 24;
    const title_text = `<0>${currency} Wallet</0>`;
    const badge_text = `<0>${jurisdiction.toUpperCase()}</0>`;
    const balance_title_text = 'Wallet balance';
    const balance_amount_text = `<0>${balance} ${currency}</0>`;

    return (
        <div className='wallet-header'>
            {/* <WalletsImage image={image_bg} /> */}
            {/* <WalletsImage image={image_currency} /> */}
            <div className='wallet-header__container'>
                <div className='wallet-header__currency'>
                    <Icon icon='IcAppstoreWalletEurLight' width={120} height={80} />
                </div>
                <div className='wallet-header__description'>
                    <div className='wallet-header__description-title'>
                        <Localize
                            i18n_default_text={title_text}
                            components={[<Text key={0} weight='bold' size={title_size} />]}
                        />
                        <Localize
                            i18n_default_text={badge_text}
                            components={[
                                <Text
                                    key={0}
                                    weight='bold'
                                    size={badge_size}
                                    line_height={badge_lh_size}
                                    className={'wallet-header__description-badge'}
                                />,
                            ]}
                        />
                    </div>

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
                <div className='wallet-header__balance'>
                    <div className='wallet-header__balance-title-amount'>
                        <Localize
                            i18n_default_text={balance_title_text}
                            components={[<Text key={0} size={balance_title_size} />]}
                        />
                        <Localize
                            i18n_default_text={balance_amount_text}
                            components={[<Text key={0} weight='bold' size={balance_amount_size} />]}
                        />
                    </div>
                    <Icon
                        onClick={() => setIsOpen(!isOpen)}
                        icon='IcChevronDownBold'
                        className={classNames('wallet-header__balance-arrow-icon', {
                            'wallet-header__balance-arrow-icon-active': isOpen,
                        })}
                    />
                </div>
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
