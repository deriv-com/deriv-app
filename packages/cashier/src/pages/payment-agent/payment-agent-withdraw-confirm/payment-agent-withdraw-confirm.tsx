import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import TransferConfirm from 'Components/transfer-confirm';
import { PaymentAgentWithdrawRequest } from '@deriv/api-types';
import { TRootStore, TServerError } from 'Types';

type PaymentAgentWithdrawConfirmProps = {
    amount: number;
    currency: string;
    client_loginid: string;
    error: TServerError;
    loginid: string;
    payment_agent_name: string;
    requestPaymentAgentWithdraw: ({
        paymentagent_withdraw,
        paymentagent_loginid,
        currency,
        amount,
        verification_code,
    }: PaymentAgentWithdrawRequest) => void;
    setIsTryWithdrawSuccessful: (status: boolean) => void;
    verification_code: string;
};

const PaymentAgentWithdrawConfirm = ({
    amount,
    currency,
    client_loginid,
    error,
    loginid,
    payment_agent_name,
    requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful,
    verification_code,
}: PaymentAgentWithdrawConfirmProps) => (
    <TransferConfirm
        data={[
            { label: localize('From account number'), value: client_loginid, key: 'transfer_from' },
            {
                label: [localize('To account number'), localize('Account holder name')],
                value: [loginid.toUpperCase(), payment_agent_name],
                key: 'transfer_to',
            },
            {
                label: localize('Amount'),
                value: <Money currency={currency} amount={amount} show_currency />,
                key: 'amount',
            },
        ]}
        error={error}
        is_payment_agent_withdraw
        onClickBack={() => {
            setIsTryWithdrawSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentWithdraw({
                paymentagent_loginid: loginid,
                currency,
                amount,
                verification_code,
                paymentagent_withdraw: 1,
            });
        }}
    />
);

export default connect(({ client, modules }: TRootStore) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    currency: modules.cashier.payment_agent.confirm.currency,
    client_loginid: client.loginid,
    error: modules.cashier.payment_agent.error,
    loginid: modules.cashier.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.payment_agent.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.payment_agent.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);
