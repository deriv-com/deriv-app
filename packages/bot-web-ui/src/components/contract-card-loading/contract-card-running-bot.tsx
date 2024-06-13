import React from 'react';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import { Loader } from '@deriv-com/ui';

const ContractCardRunningBot = () => (
    <div className='dc-contract-card-container'>
        <Loader color='var(--core-color-opacity-black-600, rgba(0, 0, 0, 0.72))' />
        <Text
            color='less-prominent'
            line_height='xs'
            size='xxs'
            weight='bold'
            align='center'
            className='dc-contract-card-message'
        >
            {localize('Your bot is running and waiting for a signal to buy a contract.')}
        </Text>
    </div>
);

export default ContractCardRunningBot;
