import React, { ComponentType, SVGAttributes } from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { WalletCardIcon } from '../WalletCardIcon';
import { WalletGradientBackground } from '../WalletGradientBackground';
import './WalletMarketCurrencyIcon.scss';

const marketTypeToIconMapper: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
    all: SwapFreeMT5Icon,
    financial: FinancialMT5Icon,
    synthetic: DerivedMT5Icon,
};

type TWalletMarketCurrencyIconProps = {
    currency: string;
    isDemo: boolean;
    marketType: string;
};

const WalletMarketCurrencyIcon = ({ currency, isDemo, marketType }: TWalletMarketCurrencyIconProps) => {
    const MarketTypeIcon = marketTypeToIconMapper[marketType];

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
