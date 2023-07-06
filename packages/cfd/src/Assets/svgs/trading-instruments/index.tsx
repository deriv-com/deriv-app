import React from 'react';
import DerivedFX from './ic-instrument-derived-fx.svg';
import Synthetics from './ic-instrument-synthetics.svg';
import Baskets from './ic-instrument-baskets.svg';
import Stocks from './ic-instrument-stocks.svg';
import StockIndices from './ic-instrument-stock-indices.svg';
import Commodities from './ic-instrument-commodities.svg';
import Forex from './ic-instrument-forex.svg';
import Cryptocurrencies from './ic-instrument-cryptocurrencies.svg';
import ETF from './ic-instrument-etf.svg';

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
