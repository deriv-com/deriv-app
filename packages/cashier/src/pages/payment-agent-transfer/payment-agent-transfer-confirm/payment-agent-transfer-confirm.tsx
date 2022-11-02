import React from 'react';
import { PaymentAgentTransferRequest } from '@deriv/api-types';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { TRootStore, TServerError } from 'Types';
import TransferConfirm from 'Components/transfer-confirm';

type PaymentAgentTransferConfirmProps = {
    amount: number;
    currency: string;
    description: string;
    error: TServerError;
    loginid: string;
    requestPaymentAgentTransfer: (arg: PaymentAgentTransferRequest) => void;
    setIsTryTransferSuccessful: (status: boolean) => void;
    transfer_to: string;
    transfer_to_name: string;
};

const PaymentAgentTransferConfirm = ({
    amount,
    currency,
    description,
    error,
    loginid,
    requestPaymentAgentTransfer,
    setIsTryTransferSuccessful,
    transfer_to,
    transfer_to_name,
}: PaymentAgentTransferConfirmProps) => {
    return (
        <TransferConfirm
            data={[
                { label: localize('From account number'), value: loginid, key: 'transfer_from' },
                {
                    label: [localize('To account number'), localize('Account holder name')],
                    value: [transfer_to.toUpperCase(), transfer_to_name],
                    key: 'transfer_to',
                },
                {
                    label: localize('Amount'),
                    value: <Money currency={currency} amount={amount} show_currency />,
                    key: 'amount',
                },
                { label: localize('Description'), value: description, key: 'description' },
            ]}
            error={error}
            onClickBack={() => {
                setIsTryTransferSuccessful(false);
            }}
            onClickConfirm={() => {
                requestPaymentAgentTransfer({
                    paymentagent_transfer: 1,
                    amount,
                    currency,
                    description,
                    transfer_to,
                });
            }}
        />
    );
};

export default connect(({ client, modules }: TRootStore) => ({
    currency: client.currency,
    loginid: client.loginid,
    amount: modules.cashier.payment_agent_transfer.confirm.amount,
    description: modules.cashier.payment_agent_transfer.confirm.description,
    error: modules.cashier.payment_agent_transfer.error,
    requestPaymentAgentTransfer: modules.cashier.payment_agent_transfer.requestPaymentAgentTransfer,
    setIsTryTransferSuccessful: modules.cashier.payment_agent_transfer.setIsTryTransferSuccessful,
    transfer_to: modules.cashier.payment_agent_transfer.confirm.client_id,
    transfer_to_name: modules.cashier.payment_agent_transfer.confirm.client_name,
}))(PaymentAgentTransferConfirm);
