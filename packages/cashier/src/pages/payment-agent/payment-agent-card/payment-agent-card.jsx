import PropTypes from 'prop-types';
import React from 'react';
import { ExpansionPanel } from '@deriv/components';
import PaymentAgentCardDescription from './payment-agent-card-description';
import PaymentAgentCardDepositDetails from './paymen-agent-card-deposit-details';
import PaymentAgentCardWithdrawalDetails from './payment-agent-card-withdrawal-details';
import './payment-agent-card.scss';

const PaymentAgentCard = ({ is_deposit, payment_agent }) => {
    const message = {
        header: <PaymentAgentCardDescription payment_agent={payment_agent} />,
        content: is_deposit ? (
            <PaymentAgentCardDepositDetails payment_agent={payment_agent} />
        ) : (
            <PaymentAgentCardWithdrawalDetails payment_agent={payment_agent} />
        ),
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
