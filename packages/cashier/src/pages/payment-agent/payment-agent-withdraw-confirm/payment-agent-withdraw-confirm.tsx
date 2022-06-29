import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import TransferConfirm from 'Components/transfer-confirm';
import { RootStore } from 'Types';

type TRequestPaymentAgentWithdraw = {
    loginid: string;
    currency: string;
    amount: string | number;
    verification_code: string | number;
};

type TPaymentAgentWithdrawConfirmProps = {
    amount: number;
    currency: string;
    error: object;
    loginid: string;
    payment_agent_name: string;
    requestPaymentAgentWithdraw: (args: TRequestPaymentAgentWithdraw) => void;
    setIsTryWithdrawSuccessful: (is_try_withdraw_successful: boolean) => void;
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
}: TPaymentAgentWithdrawConfirmProps) => (
    <TransferConfirm
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

export default connect(({ modules }: RootStore) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    currency: modules.cashier.payment_agent.confirm.currency,
    error: modules.cashier.payment_agent.error,
    loginid: modules.cashier.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.payment_agent.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.payment_agent.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);
