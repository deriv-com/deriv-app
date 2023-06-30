import React from 'react';
import { TInstrumentsIcon } from 'Components/props.types';
import TradingInstrumentsIcon from '../../Assets/svgs/trading-instruments';

const InstumentsIconWithLabel = ({ icon, text, highlighted, className, is_asterik }: TInstrumentsIcon) => {
    return (
        <div
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
            className={className}
        >
            <TradingInstrumentsIcon icon={icon} size={24} className='trading-instruments__icon' />
            <span
                style={{
                    marginLeft: '0.5rem',
                    fontWeight: 'bold',
                }}
            >
                {text}
            </span>
            {is_asterik && (
                <span className='trading-instruments__span' style={{ display: is_asterik ? 'block' : 'none' }}>
                    *
                </span>
            )}
        </div>
    );
};

export default InstumentsIconWithLabel;
