import React from 'react';
import { Money } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import TransferConfirm from 'Components/transfer-confirm';
import { useCashierStore } from '../../../stores/useCashierStores';

const PaymentAgentTransferConfirm = observer(() => {
    const { client } = useStore();
    const { payment_agent_transfer } = useCashierStore();
    const { currency, loginid } = client;
    const {
        confirm: { amount, description, client_id: transfer_to, client_name: transfer_to_name },
        error,
        requestPaymentAgentTransfer,
        setIsTryTransferSuccessful,
    } = payment_agent_transfer;

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
            is_payment_agent_transfer
            onClickBack={() => {
                setIsTryTransferSuccessful(false);
            }}
            onClickConfirm={() => {
                requestPaymentAgentTransfer({ amount, currency, description, transfer_to });
            }}
        />
    );
});

export default PaymentAgentTransferConfirm;
