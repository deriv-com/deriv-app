import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Money } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import TransferConfirm from 'Components/transfer-confirm';

const PaymentAgentWithdrawConfirm = observer(({ verification_code }) => {
    const {
        client,
        modules: {
            cashier: { payment_agent },
        },
    } = useStore();

    const { loginid: client_loginid } = client;

    const {
        confirm: { amount, currency, loginid, payment_agent_name },
        error,
        requestPaymentAgentWithdraw,
        setIsTryWithdrawSuccessful,
    } = payment_agent;

    return (
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
});

PaymentAgentWithdrawConfirm.propTypes = {
    verification_code: PropTypes.string,
};

export default PaymentAgentWithdrawConfirm;
