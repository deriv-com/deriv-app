import React from 'react';
import { Icon, Text } from '@deriv/components';
import { TMarketOptionProps } from './components.types';

const MarketOption = ({ symbol }: TMarketOptionProps) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

export default React.memo(MarketOption);
