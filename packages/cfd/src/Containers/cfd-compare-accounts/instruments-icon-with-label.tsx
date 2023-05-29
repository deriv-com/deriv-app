import React from 'react';
import TradingInstrumentsIcon from '../../Assets/svgs/trading-instruments';

interface IconProps {
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
    highlighted: boolean;
    className?: string;
}

const InstumentsIconWithLabel: React.FC<IconProps> = ({ icon, text, highlighted, className }) => {
    let size = 24;
    const dummyFunc = () => {
        size = 24;
    };
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                margin: '3px',
                opacity: highlighted ? '' : '0.2',
            }}
            className={className}
        >
            <TradingInstrumentsIcon icon={icon} size={size} className='trading-instruments__icon' onClick={dummyFunc} />
            <span
                style={{
                    marginLeft: '0.5rem',
                }}
            >
                {text}
            </span>
        </div>
    );
};

export default InstumentsIconWithLabel;
