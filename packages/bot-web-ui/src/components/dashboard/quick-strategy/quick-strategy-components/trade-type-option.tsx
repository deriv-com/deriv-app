import React from 'react';
import { IconTradeTypes, Text } from '@deriv/components';
import { TTradeTypeOptionProps } from './components.types';

const TradeTypeOption = ({ trade_type }: TTradeTypeOptionProps) => (
    <div key={trade_type.value} className='quick-strategy__option'>
        <IconTradeTypes type={trade_type.icon[0]} className='quick-strategy__icon' />
        <IconTradeTypes type={trade_type.icon[1]} className='quick-strategy__icon' />
        <Text className='quick-strategy__symbol' size='xs' color='prominent'>
            {trade_type.text}
        </Text>
    </div>
);

export default React.memo(TradeTypeOption);
