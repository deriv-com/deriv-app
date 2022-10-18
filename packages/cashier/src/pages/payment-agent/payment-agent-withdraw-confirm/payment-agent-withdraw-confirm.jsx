import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import TransferConfirm from 'Components/transfer-confirm';

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
}) => (
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
            requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code });
        }}
    />
);

PaymentAgentWithdrawConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    client_loginid: PropTypes.string,
    error: PropTypes.object,
    loginid: PropTypes.string,
    payment_agent_name: PropTypes.string,
    requestPaymentAgentWithdraw: PropTypes.func,
    setIsTryWithdrawSuccessful: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    currency: modules.cashier.payment_agent.confirm.currency,
    client_loginid: client.loginid,
    error: modules.cashier.payment_agent.error,
    loginid: modules.cashier.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.payment_agent.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.payment_agent.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);
