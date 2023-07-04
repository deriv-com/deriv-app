import React from 'react';
import DerivedFX from './ic-appstore-derived-fx.svg';
import Synthetics from './ic-appstore-synthetics.svg';
import Baskets from './ic-appstore-baskets.svg';
import Stocks from './ic-appstore-stocks.svg';
import StockIndices from './ic-appstore-stock-indices.svg';
import Commodities from './ic-appstore-commodities.svg';
import Forex from './ic-appstore-forex.svg';
import Cryptocurrencies from './ic-appstore-cryptocurrencies.svg';
import ETF from './ic-appstore-etf.svg';

export type IconProps<T> = {
    icon: T;
    className?: string;
    size?: number;
    onClick?: () => void;
};

export const InstrumentsIcons = {
    DerivedFX,
    Synthetics,
    Baskets,
    Stocks,
    StockIndices,
    Commodities,
    Forex,
    Cryptocurrencies,
    ETF,
};

const TradingInstrumentsIcon = ({ icon, className, size, onClick }: IconProps<keyof typeof InstrumentsIcons>) => {
    const InstrumentIcon = InstrumentsIcons[icon] as React.ElementType;

    return InstrumentIcon ? (
        <InstrumentIcon className={className} style={{ width: size, height: size }} onClick={onClick} />
    ) : null;
};

export default TradingInstrumentsIcon;
