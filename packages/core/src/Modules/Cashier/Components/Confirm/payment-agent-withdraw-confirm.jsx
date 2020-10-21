import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { Money } from '@deriv/components';
import Confirm from '../confirm.jsx';

const PaymentAgentWithdrawConfirm = ({
    amount,
    currency,
    error_message,
    loginid,
    payment_agent_name,
    requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful,
    verification_code,
}) => (
    <Confirm
        data={[
            { label: localize('Payment agent'), value: payment_agent_name || loginid },
            { label: localize('Amount'), value: <Money currency={currency} amount={amount} show_currency /> },
        ]}
        error_message={error_message}
        header={localize('Please confirm the transaction details in order to complete the withdrawal:')}
        onClickBack={() => {
            setIsTryWithdrawSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code });
        }}
    />
);

PaymentAgentWithdrawConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    loginid: PropTypes.string,
    payment_agent_name: PropTypes.string,
    requestPaymentAgentWithdraw: PropTypes.func,
    setIsTryWithdrawSuccessful: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    amount: modules.cashier.config.payment_agent.confirm.amount,
    currency: modules.cashier.config.payment_agent.confirm.currency,
    error_message: modules.cashier.config.payment_agent.error.message,
    loginid: modules.cashier.config.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.config.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);
