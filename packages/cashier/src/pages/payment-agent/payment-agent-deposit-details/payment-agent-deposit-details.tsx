import { toJS } from 'mobx';
import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import PaymentAgentDetail from '../payment-agent-detail';
import './payment-agent-deposit-details.scss';
import { TPaymentAgent } from '../../../types';

type TPaymentAgentDepositDetails = {
    payment_agent: TPaymentAgent;
};

const PaymentAgentPhonesDetails = (props: {
    phone_numbers: {
        phone_number?: string;
    }[];
}) => {
    return (
        <PaymentAgentDetail action='tel' icon='IcPhone' title={localize('Phone number')}>
            {props.phone_numbers.map(phone => phone.phone_number)}
        </PaymentAgentDetail>
    );
};

const PaymentAgentEmailDetails = (props: { email: string }) => {
    return (
        <PaymentAgentDetail
            action='mailto'
            icon='IcEmailOutlineNew'
            rel='noopener noreferrer'
            target='_blank'
            has_red_color
            title={localize('Email')}
        >
            {props.email}
        </PaymentAgentDetail>
    );
};

const PaymentAgentMinimumWithdrawalDetails = (props: { min_withdrawal: string; currency?: string }) => {
    return (
        <PaymentAgentDetail icon='IcCashierMinimumWithdrawal' title={localize('Minimum withdrawal')}>
            <Money amount={props.min_withdrawal || ''} currency={props.currency} show_currency />
        </PaymentAgentDetail>
    );
};

const PaymentAgentMaximumWithdrawalDetails = (props: { max_withdrawal: string; currency?: string }) => {
    return (
        <PaymentAgentDetail icon='IcCashierMaximumWithdrawal' title={localize('Maximum withdrawal')}>
            <Money amount={props.max_withdrawal || ''} currency={props.currency} show_currency />
        </PaymentAgentDetail>
    );
};

const PaymentAgentDepositComissionDetails = (props: { deposit_commission: string }) => {
    return (
        <PaymentAgentDetail
            icon='IcCashierCommissionDeposit'
            className='deposit-commission'
            title={localize('Commission on deposits')}
        >
            {`${props.deposit_commission}%`}
        </PaymentAgentDetail>
    );
};

const PaymentAgentWithdrawalComissionDetails = (props: { withdrawal_commission: string }) => {
    return (
        <PaymentAgentDetail
            icon='IcCashierCommissionWithdrawal'
            className='withdrawal_commission'
            title={localize('Commission on withdrawal')}
        >
            {`${props.withdrawal_commission}%`}
        </PaymentAgentDetail>
    );
};

const PaymentAgentDepositDetails = ({ payment_agent }: TPaymentAgentDepositDetails) => {
    const {
        phone_numbers,
        email,
        min_withdrawal,
        max_withdrawal,
        currency,
        deposit_commission,
        withdrawal_commission,
    } = payment_agent;

    const payment_agent_phones = toJS(phone_numbers);

    return (
        <div className='payment-agent-deposit-details'>
            {payment_agent_phones && <PaymentAgentPhonesDetails phone_numbers={phone_numbers} />}
            {email && <PaymentAgentEmailDetails email={email} />}
            {min_withdrawal && (
                <PaymentAgentMinimumWithdrawalDetails min_withdrawal={min_withdrawal} currency={currency} />
            )}
            {deposit_commission && <PaymentAgentDepositComissionDetails deposit_commission={deposit_commission} />}
            {max_withdrawal && (
                <PaymentAgentMaximumWithdrawalDetails currency={currency} max_withdrawal={max_withdrawal} />
            )}
            {withdrawal_commission && (
                <PaymentAgentWithdrawalComissionDetails withdrawal_commission={withdrawal_commission} />
            )}
        </div>
    );
};

export default PaymentAgentDepositDetails;
