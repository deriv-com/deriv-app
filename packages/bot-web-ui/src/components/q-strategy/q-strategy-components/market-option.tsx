import React from 'react';
import { Icon, Text } from '@deriv/components';

const MarketOption = ({ symbol }) => (
    <div key={symbol.value} className='quick-strategy__option'>
        <Icon icon={`IcUnderlying${symbol.value}`} size={32} />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {symbol.text}
        </Text>
    </div>
);

export default MarketOption;
