import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { Detail } from './paymen-agent-card-details';

const PaymentAgentCardDescription = ({ payment_agent }) => {
    const payment_agent_urls = toJS(payment_agent.urls);
    const further_information = `${payment_agent.further_information[0].toUpperCase()}${payment_agent.further_information.slice(
        1
    )}`;

    return (
        <div className='payment-agent-card__description-container'>
            <Text as='p' line_height='s' size='xs' weight='bold'>
                {payment_agent.name}
            </Text>
            {further_information && (
                <Text
                    as='p'
                    className='payment-agent-card__description-container-further-information'
                    line_height='s'
                    size='xs'
                >
                    {further_information}
                </Text>
            )}
            {payment_agent_urls && (
                <Detail target='_blank' rel='noopener noreferrer' has_red_color>
                    {Array.isArray(payment_agent_urls) ? payment_agent_urls.map(url => url.url) : payment_agent_urls}
                </Detail>
            )}
            {payment_agent.supported_banks?.length > 0 && (
                <div className='payment-agent-card__description-container-icons-container'>
                    {payment_agent.supported_banks.map((supported_bank, idx) => {
                        return <Icon key={idx} icon={`IcCashierBca`} />;
                    })}
                </div>
            )}
        </div>
    );
};

PaymentAgentCardDescription.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentCardDescription;
