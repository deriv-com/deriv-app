import React from 'react';
import { toJS } from 'mobx';
import { Money, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import PaymentAgentDetail from '../payment-agent-detail';
import { TPaymentAgent } from '../../../types';
import './payment-agent-deposit-details.scss';

type TPaymentAgentDepositDetails = {
    payment_agent: TPaymentAgent;
};

const PaymentAgentPhonesDetails = ({ phone_numbers }: Pick<TPaymentAgent, 'phone_numbers'>) => {
    return (
        <PaymentAgentDetail action='tel' icon='IcPhone' title={<Localize i18n_default_text='Phone number' />}>
            {phone_numbers.map(phone => phone.phone_number)}
        </PaymentAgentDetail>
    );
};

const PaymentAgentTransferLimitDetails = ({
    min_withdrawal,
    max_withdrawal,
    currency,
}: Pick<TPaymentAgent, 'min_withdrawal' | 'max_withdrawal' | 'currency'>) => {
    return (
        <PaymentAgentDetail icon='IcAccountTransfer' title={<Localize i18n_default_text='Transfer limit' />}>
            <React.Fragment>
                <Money amount={min_withdrawal || ''} currency={currency} show_currency />
                <Text size='xs'> - </Text>
                <Money amount={max_withdrawal || ''} currency={currency} show_currency />
            </React.Fragment>
        </PaymentAgentDetail>
    );
};

const PaymentAgentDepositComissionDetails = ({ deposit_commission }: Pick<TPaymentAgent, 'deposit_commission'>) => {
    return (
        <PaymentAgentDetail
            icon='IcCashierCommissionDeposit'
            className='deposit-commission'
            title={<Localize i18n_default_text='Commission on deposits' />}
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
            title={<Localize i18n_default_text='Commission on withdrawal' />}
        >
            {`${withdrawal_commission}%`}
        </PaymentAgentDetail>
    );
};

const PaymentAgentDepositDetails = ({ payment_agent }: TPaymentAgentDepositDetails) => {
    const { phone_numbers, min_withdrawal, max_withdrawal, currency, deposit_commission, withdrawal_commission } =
        payment_agent;

    const payment_agent_phones = toJS(phone_numbers);

    return (
        <div className='payment-agent-deposit-details'>
            {payment_agent_phones && <PaymentAgentPhonesDetails phone_numbers={phone_numbers} />}
            {min_withdrawal && max_withdrawal && (
                <PaymentAgentTransferLimitDetails
                    min_withdrawal={min_withdrawal}
                    max_withdrawal={max_withdrawal}
                    currency={currency}
                />
            )}
            {deposit_commission && <PaymentAgentDepositComissionDetails deposit_commission={deposit_commission} />}
            {withdrawal_commission && (
                <PaymentAgentWithdrawalComissionDetails withdrawal_commission={withdrawal_commission} />
            )}
        </div>
    );
};

export default PaymentAgentDepositDetails;
