import React from 'react';
import { Icon, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

export const message_running_bot = localize('Your bot is running and waiting for a signal to buy a contract.');

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
            {message_running_bot}
        </Text>
    </>
);

export default ContractCardRunningBot;
