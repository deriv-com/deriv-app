import React, { ComponentType, SVGAttributes } from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import DerivXIcon from '../../public/images/derivx.svg';
import CTraderIcon from '../../public/images/ctrader.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import type { useSortedMT5Accounts } from '@deriv/api';
import './WalletMarketCurrencyIcon.scss';

const marketTypeToIconMapper: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
    all: SwapFreeMT5Icon,
    financial: FinancialMT5Icon,
    synthetic: DerivedMT5Icon,
};

const marketTypeToPlatformIconMapper: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
    ctrader: CTraderIcon,
    dxtrade: DerivXIcon,
};

type TWalletMarketCurrencyIconProps = {
    currency: string;
    isDemo: boolean;
    marketType: Exclude<NonNullable<ReturnType<typeof useSortedMT5Accounts>['data']>[number]['market_type'], undefined>;
    platform: string;
};

const WalletMarketCurrencyIcon = ({ currency, isDemo, marketType, platform }: TWalletMarketCurrencyIconProps) => {
    const MarketTypeIcon =
        marketType === 'all' && Object.keys(marketTypeToPlatformIconMapper).includes(platform)
            ? marketTypeToPlatformIconMapper[platform]
            : marketTypeToIconMapper[marketType];

    return (
        <div className='wallets-market-currency-icon'>
            <MarketTypeIcon className='wallets-market-currency-icon__after' />
            <div
                className={`wallets-market-currency-icon__before wallets-market-currency-icon__before-${
                    isDemo ? 'demo' : 'real'
                }`}
            >
                <WalletGradientBackground currency={currency} hasShine isDemo={isDemo} type='card'>
                    <WalletCardIcon type={isDemo ? 'Demo' : currency} />
                </WalletGradientBackground>
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
