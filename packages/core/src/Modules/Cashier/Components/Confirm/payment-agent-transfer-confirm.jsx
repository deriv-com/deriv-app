import PropTypes from 'prop-types';
import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { Button, Icon, Money } from '@deriv/components';

const Row = ({ label, value }) => (
    <div className='payment-agent-transfer__confirm-row'>
        <span>{label}</span>
        {Array.isArray(value) ? (
            <span>
                {value.map((v, idx) => (
                    <React.Fragment key={idx}>
                        <strong>{v}</strong>
                        <br />
                    </React.Fragment>
                ))}
            </span>
        ) : (
            <strong>{value}</strong>
        )}
    </div>
);

const PaymentAgentTransferConfirm = ({
    amount,
    currency,
    description,
    loginid,
    requestPaymentAgentTransfer,
    setIsTryTransferSuccessful,
    transfer_to,
    transfer_to_name,
}) => (
    <div className='cashier__wrapper'>
        <Icon icon='IcConfirmDetails' width='128' height='128' />
        <h2 className='cashier__header payment-agent-transfer__confirm-header'>
            <Localize i18n_default_text='Please confirm the transaction details in order to complete the transfer:' />
        </h2>
        <div className='payment-agent-transfer__confirm-column-wrapper'>
            <div className='payment-agent-transfer__confirm-column'>
                <Row label='Transfer from' value={loginid} />
                <Row label='Transfer to' value={[transfer_to, transfer_to_name]} />
                <Row label='Amount' value={<Money currency={currency} amount={amount} />} />
                <Row label='Description' value={description} />
            </div>
        </div>
        <div className='payment-agent-transfer__confirm-submit'>
            <Button large text={localize('Back')} onClick={() => setIsTryTransferSuccessful(false)} secondary />
            <Button
                large
                text={localize('Confirm')}
                onClick={() => {
                    requestPaymentAgentTransfer({ amount, currency, description, transfer_to });
                }}
                primary
            />
        </div>
    </div>
);

PaymentAgentTransferConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    description: PropTypes.string,
    loginid: PropTypes.string,
    requestPaymentAgentTransfer: PropTypes.func,
    setIsTryTransferSuccessful: PropTypes.func,
    setReceiptPaymentAgentTransfer: PropTypes.func,
    transfer_to: PropTypes.string,
    transfer_to_name: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    loginid: client.loginid,
    amount: modules.cashier.config.payment_agent_transfer.confirm.amount,
    description: modules.cashier.config.payment_agent_transfer.confirm.description,
    requestPaymentAgentTransfer: modules.cashier.requestPaymentAgentTransfer,
    setIsTryTransferSuccessful: modules.cashier.setIsTryTransferSuccessful,
    setReceiptPaymentAgentTransfer: modules.cashier.setReceiptPaymentAgentTransfer,
    transfer_to: modules.cashier.config.payment_agent_transfer.confirm.client_id,
    transfer_to_name: modules.cashier.config.payment_agent_transfer.confirm.client_name,
}))(PaymentAgentTransferConfirm);
