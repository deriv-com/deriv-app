import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { ExpansionPanel } from '@deriv/components';
import PaymentAgentCardDescription from './payment-agent-card-description.jsx';
import PaymentAgentDepositDetails from '../payment-agent-deposit-details';
import PaymentAgentListedWithdrawForm from '../payment-agent-listed-withdraw-form';
import './payment-agent-card.scss';

const PaymentAgentCard = ({ is_dark_mode_on, is_deposit, payment_agent }) => {
    const message = {
        header: <PaymentAgentCardDescription is_dark_mode_on={is_dark_mode_on} payment_agent={payment_agent} />,
        content: is_deposit ? (
            <PaymentAgentDepositDetails payment_agent={payment_agent} />
        ) : (
            <PaymentAgentListedWithdrawForm payment_agent={payment_agent} />
        ),
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
    is_deposit: PropTypes.bool,
    payment_agent: PropTypes.object,
};

export default PaymentAgentCard;
