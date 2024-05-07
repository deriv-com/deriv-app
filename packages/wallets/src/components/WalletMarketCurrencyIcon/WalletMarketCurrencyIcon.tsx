import React, { FC } from 'react';
import { MARKET_TYPE } from '../../features/cfd/constants';
import { THooks, TPlatforms } from '../../types';
import { WalletCurrencyCard } from '../WalletCurrencyCard';
import { WalletMarketIcon } from '../WalletMarketIcon';
import './WalletMarketCurrencyIcon.scss';

const mt5MarketTypeIcon = {
    all: 'IcWalletMt5All',
    financial: 'IcWalletMt5Financial',
    synthetic: 'IcWalletMt5Derived',
};

const cfdPlatformIcon = {
    ctrader: 'IcWalletCTrader',
    dxtrade: 'IcWalletDerivX',
};

type TWalletMarketCurrencyIconProps = {
    currency: Exclude<THooks.ActiveWalletAccount['currency'], undefined>;
    isDemo: THooks.ActiveWalletAccount['is_virtual'];
    marketType?: keyof typeof mt5MarketTypeIcon;
    platform?: TPlatforms.All;
};

const WalletMarketCurrencyIcon: FC<TWalletMarketCurrencyIconProps> = ({ currency, isDemo, marketType, platform }) => {
    const MarketTypeIcon =
        marketType && platform && marketType === MARKET_TYPE.ALL && platform in cfdPlatformIcon
            ? cfdPlatformIcon[platform as keyof typeof cfdPlatformIcon]
            : mt5MarketTypeIcon[marketType as keyof typeof mt5MarketTypeIcon];

    return (
        <div className='wallets-market-currency-icon'>
            <div className='wallets-market-currency-icon__container'>
                <WalletMarketIcon
                    className='wallets-market-currency-icon__market-icon'
                    icon={MarketTypeIcon ?? 'IcWalletOptionsLight'}
                    size='sm'
                />
                <WalletCurrencyCard
                    className='wallets-market-currency-icon__currency-icon'
                    currency={currency}
                    isDemo={isDemo}
                    size='xs'
                />
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
