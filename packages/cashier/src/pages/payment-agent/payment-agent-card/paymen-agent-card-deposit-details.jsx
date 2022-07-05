import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import Detail from 'Components/detail';

const PaymentAgentCardDetails = ({ payment_agent }) => {
    const payment_agent_phones = toJS(payment_agent.phones);
    const detail_titles = {
        email: localize('Email'),
        phone_number: localize('Phone number'),
        deposit_commission: localize('Commission on deposits'),
        withdrawal_commission: localize('Commission on withdrawal'),
        min_withdrawal: localize('Minimum withdrawal'),
        max_withdrawal: localize('Maximum withdrawal'),
    };

    return (
        <div className='payment-agent-card__deposit-details-container'>
            {payment_agent_phones && (
                <Detail action='tel' icon='Phone' title={detail_titles.phone_number}>
                    {Array.isArray(payment_agent.phones)
                        ? payment_agent.phones.map(phone => phone.phone_number)
                        : payment_agent.phones}
                </Detail>
            )}
            {payment_agent.email && (
                <Detail
                    action='mailto'
                    icon='Email'
                    rel='noopener noreferrer'
                    target='_blank'
                    title={detail_titles.email}
                    has_red_color
                >
                    {payment_agent.email}
                </Detail>
            )}
            {payment_agent.min_withdrawal && (
                <Detail icon='MinimumWithdrawal' title={detail_titles.min_withdrawal}>
                    <Money amount={payment_agent.min_withdrawal} currency={payment_agent.currency} show_currency />
                </Detail>
            )}
            {payment_agent.deposit_commission && (
                <Detail
                    icon='CommissionDeposit'
                    className='deposit-commission'
                    title={detail_titles.deposit_commission}
                >
                    {`${payment_agent.deposit_commission}%`}
                </Detail>
            )}
            {payment_agent.max_withdrawal && (
                <Detail icon='MaximumWithdrawal' title={detail_titles.max_withdrawal}>
                    <Money amount={payment_agent.max_withdrawal} currency={payment_agent.currency} show_currency />
                </Detail>
            )}
            {payment_agent.withdrawal_commission && (
                <Detail
                    icon='CommissionWithdrawal'
                    className='withdrawal_commission'
                    title={detail_titles.withdrawal_commission}
                >
                    {`${payment_agent.withdrawal_commission}%`}
                </Detail>
            )}
        </div>
    );
};

PaymentAgentCardDetails.propTypes = {
    payment_agent: PropTypes.object,
};

export default PaymentAgentCardDetails;
