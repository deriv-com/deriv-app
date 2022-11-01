import PropTypes from 'prop-types';
import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import TransferConfirm from 'Components/transfer-confirm';

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
}) => {
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
};

PaymentAgentTransferConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.object,
    loginid: PropTypes.string,
    requestPaymentAgentTransfer: PropTypes.func,
    setIsTryTransferSuccessful: PropTypes.func,
    transfer_to: PropTypes.string,
    transfer_to_name: PropTypes.string,
};

export default connect(({ client, modules }) => ({
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
