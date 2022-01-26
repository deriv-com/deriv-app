import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import Confirm from '../confirm.jsx';

type PaymentAgentWithdrawConfirmProps = {
    amount: number;
    currency: string;
    error: unknown;
    loginid: string;
    payment_agent_name: string;
    requestPaymentAgentWithdraw: () => void;
    setIsTryWithdrawSuccessful: () => void;
    verification_code: string;
};

const PaymentAgentWithdrawConfirm = ({
    amount,
    currency,
    error,
    loginid,
    payment_agent_name,
    requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful,
    verification_code,
}: PaymentAgentWithdrawConfirmProps) => (
    <Confirm
        data={[
            { label: localize('Payment agent'), value: payment_agent_name || loginid, key: 'pa' },
            {
                label: localize('Amount'),
                value: <Money currency={currency} amount={amount} show_currency />,
                key: 'amount',
            },
        ]}
        error={error}
        header={localize('Please confirm the transaction details in order to complete the withdrawal:')}
        onClickBack={() => {
            setIsTryWithdrawSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code });
        }}
    />
);

export default connect(({ modules }) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    currency: modules.cashier.payment_agent.confirm.currency,
    error: modules.cashier.payment_agent.error,
    loginid: modules.cashier.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.payment_agent.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.payment_agent.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);
