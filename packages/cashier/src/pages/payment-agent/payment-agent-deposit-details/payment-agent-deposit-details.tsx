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

const PaymentAgentDepositDetails = ({ payment_agent }: TPaymentAgentDepositDetails) => {
    const payment_agent_phones = toJS(payment_agent.phone_numbers);

    const PaymentAgentPhonesDetails = () => {
        return (
            <PaymentAgentDetail action='tel' icon='IcPhone' title={localize('Phone number')}>
                {payment_agent.phone_numbers.map(phone => phone.phone_number)}
            </PaymentAgentDetail>
        );
    };

    const PaymentAgentTransferLimitDetails = () => {
        return (
            <PaymentAgentDetail icon='IcAccountTransfer' title={localize('Transfer limit')}>
                <>
                    <Money
                        amount={payment_agent.min_withdrawal || ''}
                        currency={payment_agent.currency}
                        show_currency
                    />{' '}
                    -{' '}
                    <Money
                        amount={payment_agent.max_withdrawal || ''}
                        currency={payment_agent.currency}
                        show_currency
                    />
                </>
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
            {payment_agent.min_withdrawal && payment_agent.max_withdrawal && <PaymentAgentTransferLimitDetails />}
            {payment_agent.deposit_commission && <PaymentAgentDepositComissionDetails />}
            {payment_agent.withdrawal_commission && <PaymentAgentWithdrawalComissionDetails />}
        </div>
    );
};

export default PaymentAgentDepositDetails;
