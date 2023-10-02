import React from 'react';
import { Text } from '@deriv/components';
import { TInstrumentsIcon } from 'Components/props.types';
import TradingInstrumentsIcon from '../../Assets/svgs/trading-instruments';

const InstrumentsIconWithLabel = ({ icon, text, highlighted, className, is_asterisk }: TInstrumentsIcon) => {
    return (
        <div
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
            data-testid='dt_instruments_icon_container'
            className={className}
        >
            <TradingInstrumentsIcon icon={icon} size={24} className='trading-instruments__icon' />
            <Text as='p' weight='bolder' line_height='xs' size='xxs' align='left' className='trading-instruments__text'>
                {text}
            </Text>
            {is_asterisk && (
                <span className='trading-instruments__span' style={{ display: is_asterisk ? 'block' : 'none' }}>
                    *
                </span>
            )}
        </div>
    );
};

export default InstrumentsIconWithLabel;
