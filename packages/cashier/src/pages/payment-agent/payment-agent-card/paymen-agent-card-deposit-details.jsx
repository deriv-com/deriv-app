import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import Detail from 'Components/detail';

const PaymentAgentCardDetails = ({ payment_agent }) => {
    const payment_agent_phones = toJS(payment_agent.phones);

    const PaymentAgentPhonesDetails = () => {
        return (
            <Detail action='tel' icon='Phone' title={localize('Phone number')}>
                {payment_agent.phones.map(phone => phone.phone_number)}
            </Detail>
        );
    };

    const PaymentAgentEmailDetails = () => {
        return (
            <Detail
                action='mailto'
                icon='Email'
                rel='noopener noreferrer'
                target='_blank'
                has_red_color
                title={localize('Email')}
            >
                {payment_agent.email}
            </Detail>
        );
    };

    const PaymentAgentMinimumWithdrawalDetails = () => {
        return (
            <Detail icon='MinimumWithdrawal' title={localize('Minimum withdrawal')}>
                <Money amount={payment_agent.min_withdrawal} currency={payment_agent.currency} show_currency />
            </Detail>
        );
    };

    const PaymentAgentMaximumWithdrawalDetails = () => {
        return (
            <Detail icon='MaximumWithdrawal' title={localize('Maximum withdrawal')}>
                <Money amount={payment_agent.max_withdrawal} currency={payment_agent.currency} show_currency />
            </Detail>
        );
    };

    const PaymentAgentDepositComissionDetails = () => {
        return (
            <Detail icon='CommissionDeposit' className='deposit-commission' title={localize('Commission on deposits')}>
                {`${payment_agent.deposit_commission}%`}
            </Detail>
        );
    };

    const PaymentAgentWithdrawalComissionDetails = () => {
        return (
            <Detail
                icon='CommissionWithdrawal'
                className='withdrawal_commission'
                title={localize('Commission on withdrawal')}
            >
                {`${payment_agent.withdrawal_commission}%`}
            </Detail>
        );
    };

    return (
        <div className='payment-agent-card__deposit-details-container'>
            {payment_agent_phones && <PaymentAgentPhonesDetails />}
            {payment_agent.email && <PaymentAgentEmailDetails />}
            {payment_agent.min_withdrawal && <PaymentAgentMinimumWithdrawalDetails />}
            {payment_agent.deposit_commission && <PaymentAgentDepositComissionDetails />}
            {payment_agent.max_withdrawal && <PaymentAgentMaximumWithdrawalDetails />}
            {payment_agent.withdrawal_commission && <PaymentAgentWithdrawalComissionDetails />}
        </div>
    );
};

PaymentAgentCardDetails.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentCardDetails;
