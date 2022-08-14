import PropTypes from 'prop-types';
import React from 'react';
import { Icon, Money, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import TransferConfirm from 'Components/transfer-confirm';
import './payment-agent-transfer-confirm.scss';

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
    const payment_agent_transfer_warning_messages = [
        <Localize
            i18n_default_text='Please ensure <0>all details</0> are <0>correct</0> before making your transfer.'
            components={[<strong key={0} />]}
            key={0}
        />,
        <Localize
            i18n_default_text='We <0>do not</0> guarantee a refund if you make a wrong transfer.'
            components={[<strong key={0} />]}
            key={1}
        />,
    ];
    return (
        <div className='cashier__wrapper'>
            <Icon
                icon='IcCashierRedWarning'
                className='payment-agent-transfer-confirm__warning-icon'
                data_testid='dti_red_warning_icon'
            />
            <Text
                as='h2'
                color='loss-danger'
                weight='bold'
                align='center'
                className='payment-agent-transfer-confirm__warning-icon__description'
                size={isMobile() ? 'xs' : ''}
            >
                {localize('Check transfer information')}
            </Text>
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
                warning_messages={payment_agent_transfer_warning_messages}
            />
        </div>
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
