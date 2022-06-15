import PropTypes from 'prop-types';
import React from 'react';
import { ExpansionPanel } from '@deriv/components';
import PaymentAgentCardDescription from './payment-agent-card-description';
import PaymentAgentCardDetails from './paymen-agent-card-details';
import './payment-agent-card.scss';

const PaymentAgentCard = ({ payment_agent }) => {
    const message = {
        header: <PaymentAgentCardDescription payment_agent={payment_agent} />,
        content: <PaymentAgentCardDetails payment_agent={payment_agent} />,
    };
    return (
        <div className='payment-agent-card'>
            <ExpansionPanel message={message} />
        </div>
    );
};

PaymentAgentCard.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentCard;
