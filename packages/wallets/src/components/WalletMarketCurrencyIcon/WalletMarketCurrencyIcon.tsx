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
    is_demo: boolean;
    market_type: string;
    size: 'lg' | 'md' | 'sm';
};

const WalletMarketCurrencyIcon = ({ currency, is_demo, market_type, size }: TWalletMarketCurrencyIconProps) => {
    const MarketTypeIcon = React.useMemo(() => market_type_to_icon_mapper[market_type], [market_type]);

    return (
        <div className={`wallets-market-currency-icon wallets-market-currency-icon--${size}`}>
            <MarketTypeIcon className='wallets-market-currency-icon__after' />
            <div
                className={`wallets-market-currency-icon__before wallets-market-currency-icon__before-${
                    is_demo ? 'demo' : 'real'
                }`}
            >
                <WalletGradientBackground currency={currency} has_shine is_demo={is_demo} type='card'>
                    <WalletListCardIcon type={is_demo ? 'Demo' : currency} />
                </WalletGradientBackground>
            </div>
        </div>
    );
};

export default WalletMarketCurrencyIcon;
