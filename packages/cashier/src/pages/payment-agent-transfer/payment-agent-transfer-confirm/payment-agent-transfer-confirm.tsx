import React from 'react';
import { Icon, Money, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { PaymentAgentTransferRequest } from '@deriv/api-types';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';
import TransferConfirm from 'Components/transfer-confirm';
import './payment-agent-transfer-confirm.scss';

type TPaymentAgentTransferConfirm = {
    amount: number;
    currency: string;
    description: string;
    error: object;
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
}: TPaymentAgentTransferConfirm) => {
    const payment_agent_transfer_warning_messages = [
        <Localize
            i18n_default_text='<0>Remember</0>, it’s solely your responsibility to ensure the transfer is made to the correct account.'
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
                data_testid='dt_red_warning_icon'
            />
            <Text
                as='h2'
                color='loss-danger'
                weight='bold'
                align='center'
                className='payment-agent-transfer-confirm__warning-icon__description'
                size={isMobile() ? 'xs' : ''}
            >
                {localize('Check Transfer Information')}
            </Text>
            <TransferConfirm
                data={[
                    { label: localize('Transfer from'), value: loginid, key: 'transfer_from' },
                    {
                        label: localize('Transfer to'),
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
                    requestPaymentAgentTransfer({
                        paymentagent_transfer: 1,
                        amount,
                        currency,
                        description,
                        transfer_to,
                    });
                }}
                warning_messages={payment_agent_transfer_warning_messages}
            />
        </div>
    );
};

export default connect(({ client, modules }: RootStore) => ({
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
