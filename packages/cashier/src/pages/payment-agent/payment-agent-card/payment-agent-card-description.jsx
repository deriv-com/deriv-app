import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import React from 'react';
import { Icon, Text } from '@deriv/components';
import { capitalizeFirstLetter } from '@deriv/shared';
import { hasNormalizedPaymentMethods, getUniquePaymentAgentSupportedBanks } from './helpers';
import { connect } from 'Stores/connect';
import { Detail } from './paymen-agent-card-deposit-details';

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
            {hasNormalizedPaymentMethods(payment_agent.supported_banks) && (
                <div className='payment-agent-card__description-container-icons-container'>
                    {getUniquePaymentAgentSupportedBanks(payment_agent.supported_banks).map((bank, idx) => {
                        return (
                            <Icon
                                data_testid='dt_payment_method_icon'
                                key={idx}
                                icon={`IcCashier${bank}${is_dark_mode_on ? 'Dark' : 'Light'}`}
                            />
                        );
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
