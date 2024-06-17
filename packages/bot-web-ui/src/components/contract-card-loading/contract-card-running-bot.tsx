import React from 'react';
import { localize } from '@deriv/translations';
import { Icon, Text } from '@deriv/components';

const ContractCardRunningBot = () => (
    <>
        <Icon id='rotate-icon' icon='IcCircleLoader' color='black' size={16} />
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
    </>
);

export default ContractCardRunningBot;
