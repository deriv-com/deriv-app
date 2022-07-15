import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { ExpansionPanel } from '@deriv/components';
import PaymentAgentCardDescription from './payment-agent-card-description.jsx';
import PaymentAgentCardDepositDetails from './paymen-agent-card-deposit-details.jsx';
import './payment-agent-card.scss';

const PaymentAgentCard = ({ is_dark_mode_on, payment_agent }) => {
    const message = {
        header: <PaymentAgentCardDescription payment_agent={payment_agent} />,
        content: <PaymentAgentCardDepositDetails payment_agent={payment_agent} />,
    };
    return (
        <div
            className={classNames('payment-agent-card', {
                'payment-agent-card--dark': is_dark_mode_on,
            })}
        >
            <ExpansionPanel message={message} />
        </div>
    );
};

PaymentAgentCard.propTypes = {
    is_dark_mode_on: PropTypes.bool,
    payment_agent: PropTypes.object,
};

export default PaymentAgentCard;
