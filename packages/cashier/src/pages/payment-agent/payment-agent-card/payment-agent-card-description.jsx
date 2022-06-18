import { toJS } from 'mobx';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { capitalizeFirstLetter } from '@deriv/shared';
import { getNormalizedPaymentMethod } from './helpers';
import { connect } from 'Stores/connect';
import { Detail } from './paymen-agent-card-details';

const PaymentAgentCardDescription = ({ is_dark_mode_on, payment_agent }) => {
    const payment_agent_urls = toJS(payment_agent.urls);

    return (
        <div className='payment-agent-card__description-container'>
            <Text as='p' line_height='s' size='xs' weight='bold'>
                {payment_agent.name}
            </Text>
            {payment_agent.further_information && (
                <Text
                    as='p'
                    className='payment-agent-card__description-container-further-information'
                    line_height='s'
                    size='xs'
                >
                    {capitalizeFirstLetter(payment_agent.further_information)}
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
                        const normalized_payment_method = getNormalizedPaymentMethod(supported_bank.payment_method);
                        return normalized_payment_method ? (
                            <Icon
                                data_testid='dt_payment_method_icon'
                                key={idx}
                                icon={`IcCashier${normalized_payment_method}${is_dark_mode_on ? 'Dark' : 'Light'}`}
                            />
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};

PaymentAgentCardDescription.propTypes = {
    is_dark_mode_on: PropTypes.bool,
    payment_agent: PropTypes.object,
};

export default connect(({ ui }) => ({
    is_dark_mode_on: ui.is_dark_mode_on,
}))(PaymentAgentCardDescription);
