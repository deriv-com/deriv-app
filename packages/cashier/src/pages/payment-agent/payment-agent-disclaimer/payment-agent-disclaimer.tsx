import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { website_name } from '@deriv/shared';
import './payment-agent-disclaimer.scss';

const PaymentAgentDisclaimer = () => {
    return (
        <div className='payment-agent-disclaimer'>
            <Text as='p' className='payment-agent-disclaimer__title' size='xs' lh='m' weight='bold'>
                <Localize i18n_default_text='DISCLAIMER' />
            </Text>
            <Text as='p' size='xxs' lh='s'>
                <Localize
                    i18n_default_text='{{website_name}} is not affiliated with any payment agents. Customers deal with payment agents at their sole risk. Customers are advised to check the credentials of payment agents and the accuracy of any information about payment agents (on {{website_name}} or elsewhere) before using their services.'
                    values={{ website_name }}
                />
            </Text>
        </div>
    );
};

export default PaymentAgentDisclaimer;
