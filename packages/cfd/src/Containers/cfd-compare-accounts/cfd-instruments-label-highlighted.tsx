import React from 'react';
import InstumentsIconWithLabel from './instruments-icon-with-label';

type TIconData = {
    icon:
        | 'DerivedFX'
        | 'Synthetics'
        | 'BasketIndices'
        | 'Stocks'
        | 'StockIndices'
        | 'Commodities'
        | 'Forex'
        | 'Cryptocurrencies'
        | 'ETF';
    text: string;
};

const CFDInstrumentsLabelHighlighted: React.FC = () => {
    const iconData: TIconData[] = [
        { icon: 'Synthetics', text: 'Synthetics' },
        { icon: 'BasketIndices', text: 'Basket Indices' },
        { icon: 'DerivedFX', text: 'Derived FX' },
        { icon: 'Stocks', text: 'Stock' },
        { icon: 'StockIndices', text: 'Stock Indices' },
        { icon: 'Commodities', text: 'Commodities' },
        { icon: 'Forex', text: 'Forex' },
        { icon: 'Cryptocurrencies', text: 'Cryptocurrencies' },
        { icon: 'ETF', text: 'ETF' },
    ];

    return (
        <div className={'compare-cfd-account-outline'}>
            {iconData.map(item => (
                <InstumentsIconWithLabel key={item.text} icon={item.icon} text={item.text} highlighted={true} />
            ))}
        </div>
    );
};

export default CFDInstrumentsLabelHighlighted;
