import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import PaymentAgentDetail from '../payment-agent-detail';
import './payment-agent-deposit-details.scss';

const PaymentAgentDepositDetails = ({ payment_agent }) => {
    const payment_agent_phones = toJS(payment_agent.phones);

    const PaymentAgentPhonesDetails = () => {
        return (
            <PaymentAgentDetail action='tel' icon='IcPhone' title={localize('Phone number')}>
                {payment_agent.phones.map(phone => phone.phone_number)}
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentEmailDetails = () => {
        return (
            <PaymentAgentDetail
                action='mailto'
                icon='IcEmailOutlineNew'
                rel='noopener noreferrer'
                target='_blank'
                has_red_color
                title={localize('Email')}
            >
                {payment_agent.email}
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentMinimumWithdrawalDetails = () => {
        return (
            <PaymentAgentDetail icon='IcCashierMinimumWithdrawal' title={localize('Minimum withdrawal')}>
                <Money amount={payment_agent.min_withdrawal} currency={payment_agent.currency} show_currency />
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentMaximumWithdrawalDetails = () => {
        return (
            <PaymentAgentDetail icon='IcCashierMaximumWithdrawal' title={localize('Maximum withdrawal')}>
                <Money amount={payment_agent.max_withdrawal} currency={payment_agent.currency} show_currency />
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentDepositComissionDetails = () => {
        return (
            <PaymentAgentDetail
                icon='IcCashierCommissionDeposit'
                className='deposit-commission'
                title={localize('Commission on deposits')}
            >
                {`${payment_agent.deposit_commission}%`}
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentWithdrawalComissionDetails = () => {
        return (
            <PaymentAgentDetail
                icon='IcCashierCommissionWithdrawal'
                className='withdrawal_commission'
                title={localize('Commission on withdrawal')}
            >
                {`${payment_agent.withdrawal_commission}%`}
            </PaymentAgentDetail>
        );
    };

    return (
        <div className='payment-agent-deposit-details'>
            {payment_agent_phones && <PaymentAgentPhonesDetails />}
            {payment_agent.email && <PaymentAgentEmailDetails />}
            {payment_agent.min_withdrawal && <PaymentAgentMinimumWithdrawalDetails />}
            {payment_agent.deposit_commission && <PaymentAgentDepositComissionDetails />}
            {payment_agent.max_withdrawal && <PaymentAgentMaximumWithdrawalDetails />}
            {payment_agent.withdrawal_commission && <PaymentAgentWithdrawalComissionDetails />}
        </div>
    );
};

PaymentAgentDepositDetails.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentDepositDetails;
