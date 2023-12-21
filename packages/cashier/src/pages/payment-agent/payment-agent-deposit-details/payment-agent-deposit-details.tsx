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

const PaymentAgentPhonesDetails = ({ phone_numbers }: Pick<TPaymentAgent, 'phone_numbers'>) => {
    return (
        <PaymentAgentDetail action='tel' icon='IcPhone' title={localize('Phone number')}>
            {phone_numbers.map(phone => phone.phone_number)}
        </PaymentAgentDetail>
    );
};

const PaymentAgentEmailDetails = ({ email }: Pick<TPaymentAgent, 'email'>) => {
    return (
        <PaymentAgentDetail
            action='mailto'
            icon='IcEmailOutlineNew'
            rel='noopener noreferrer'
            target='_blank'
            has_red_color
            title={localize('Email')}
        >
            {email}
        </PaymentAgentDetail>
    );
};

const PaymentAgentMinimumWithdrawalDetails = ({
    min_withdrawal,
    currency,
}: Pick<TPaymentAgent, 'min_withdrawal' | 'currency'>) => {
    return (
        <PaymentAgentDetail icon='IcCashierMinimumWithdrawal' title={localize('Minimum withdrawal')}>
            <Money amount={min_withdrawal || ''} currency={currency} show_currency />
        </PaymentAgentDetail>
    );
};

const PaymentAgentMaximumWithdrawalDetails = ({
    max_withdrawal,
    currency,
}: Pick<TPaymentAgent, 'max_withdrawal' | 'currency'>) => {
    return (
        <PaymentAgentDetail icon='IcCashierMaximumWithdrawal' title={localize('Maximum withdrawal')}>
            <Money amount={max_withdrawal || ''} currency={currency} show_currency />
        </PaymentAgentDetail>
    );
};

const PaymentAgentDepositComissionDetails = ({ deposit_commission }: Pick<TPaymentAgent, 'deposit_commission'>) => {
    return (
        <PaymentAgentDetail
            icon='IcCashierCommissionDeposit'
            className='deposit-commission'
            title={localize('Commission on deposits')}
        >
            {`${deposit_commission}%`}
        </PaymentAgentDetail>
    );
};

const PaymentAgentWithdrawalComissionDetails = ({
    withdrawal_commission,
}: Pick<TPaymentAgent, 'withdrawal_commission'>) => {
    return (
        <PaymentAgentDetail
            icon='IcCashierCommissionWithdrawal'
            className='withdrawal_commission'
            title={localize('Commission on withdrawal')}
        >
            {`${withdrawal_commission}%`}
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
