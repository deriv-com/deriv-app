import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { Money } from '@deriv/components';
import Confirm from '../confirm.jsx';

const PaymentAgentTransferConfirm = ({
    amount,
    currency,
    description,
    error_message,
    loginid,
    requestPaymentAgentTransfer,
    setIsTryTransferSuccessful,
    transfer_to,
    transfer_to_name,
}) => (
    <Confirm
        data={[
            { label: localize('Transfer from'), value: loginid },
            { label: localize('Transfer to'), value: [transfer_to, transfer_to_name] },
            { label: localize('Amount'), value: <Money currency={currency} amount={amount} show_currency /> },
            { label: localize('Description'), value: description },
        ]}
        error_message={error_message}
        header={localize('Please confirm the transaction details in order to complete the transfer:')}
        onClickBack={() => {
            setIsTryTransferSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentTransfer({ amount, currency, description, transfer_to });
        }}
    />
);

PaymentAgentTransferConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    description: PropTypes.string,
    loginid: PropTypes.string,
    requestPaymentAgentTransfer: PropTypes.func,
    setIsTryTransferSuccessful: PropTypes.func,
    transfer_to: PropTypes.string,
    transfer_to_name: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    loginid: client.loginid,
    amount: modules.cashier.config.payment_agent_transfer.confirm.amount,
    description: modules.cashier.config.payment_agent_transfer.confirm.description,
    error_message: modules.cashier.config.payment_agent_transfer.error.message,
    requestPaymentAgentTransfer: modules.cashier.requestPaymentAgentTransfer,
    setIsTryTransferSuccessful: modules.cashier.setIsTryTransferSuccessful,
    transfer_to: modules.cashier.config.payment_agent_transfer.confirm.client_id,
    transfer_to_name: modules.cashier.config.payment_agent_transfer.confirm.client_name,
}))(PaymentAgentTransferConfirm);
