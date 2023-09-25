import React, { ComponentType, SVGAttributes } from 'react';
import DerivedMT5Icon from '../../public/images/mt5-derived.svg';
import FinancialMT5Icon from '../../public/images/mt5-financial.svg';
import SwapFreeMT5Icon from '../../public/images/mt5-swap-free.svg';
import { WalletGradientBackground } from '../WalletGradientBackground';
import { WalletListCardIcon } from '../WalletListCardIcon';
import './WalletMarketCurrencyIcon.scss';

const market_type_to_icon_mapper: Record<string, ComponentType<SVGAttributes<SVGElement>>> = {
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
    const MarketTypeIcon = React.useMemo(() => market_type_to_icon_mapper[marketType], [marketType]);

    return (
        <div className='wallets-market-currency-icon'>
            <MarketTypeIcon className='wallets-market-currency-icon__after' />
            <div
                className={`wallets-market-currency-icon__before wallets-market-currency-icon__before-${
                    isDemo ? 'demo' : 'real'
                }`}
            >
                <WalletGradientBackground currency={currency} has_shine is_demo={isDemo} type='card'>
                    <WalletListCardIcon type={isDemo ? 'Demo' : currency} />
                </WalletGradientBackground>
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
