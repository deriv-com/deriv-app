import React from 'react';
import { withRouter } from 'react-router';
import { History } from 'history';
import { Button, Icon, Text } from '@deriv/components';
import { routes, formatMoney, getCurrencyDisplayCode, getCurrencyName } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { RootStore } from 'Types';
import './payment-agent-transfer-receipt.scss';

type TPaymentAgentTransferReceipt = {
    currency: string;
    history: History;
    is_from_derivgo: boolean;
    loginid: string;
    receipt: {
        amount_transferred?: string;
        client_name?: string;
        client_id?: string;
    };
    resetPaymentAgentTransfer: () => void;
};

const openStatement = (history: History, resetPaymentAgentTransfer: () => void) => {
    history.push(routes.statement);
    resetPaymentAgentTransfer();
};

const PaymentAgentTransferReceipt = ({
    currency,
    history,
    is_from_derivgo,
    loginid,
    receipt,
    resetPaymentAgentTransfer,
}: TPaymentAgentTransferReceipt) => (
    <div className='cashier__wrapper payment-agent-transfer-receipt__wrapper'>
        <div className='cashier__success'>
            <Text as='h2' color='prominent' align='center' weight='bold' className='cashier__header'>
                <Localize i18n_default_text='Your funds have been transferred' />
            </Text>
            <Text
                as='p'
                size='l'
                weight='bold'
                lh='xs'
                color='profit-success'
                align='center'
                className='cashier__transferred-amount'
            >
                {formatMoney(currency, receipt.amount_transferred, true)} {getCurrencyDisplayCode(currency)}
            </Text>
            <div className='cashier__transferred-details-wrapper'>
                <span className='account-transfer__transfer-details-from'>
                    <Icon icon={`IcCurrency-${currency.toLowerCase()}`} />
                    <span className='cashier__transferred-details'>
                        <Text size='xs' line_height='xs' weight='bold'>
                            {getCurrencyName(currency)}
                        </Text>
                        <Text size='xs' line_height='xs' color='less-prominent'>
                            {loginid}
                        </Text>
                    </span>
                </span>
                <Icon className='cashier__transferred-icon' icon='IcArrowLeftBold' />
                <span className='account-transfer__transfer-details-to'>
                    <Icon icon='IcClient' />
                    <span className='cashier__transferred-details'>
                        <Text size='xs' line_height='xs' weight='bold' align='center'>
                            {receipt.client_name}
                        </Text>
                        <Text size='xs' line_height='xs' color='less-prominent'>
                            {receipt.client_id && receipt.client_id.toUpperCase()}
                        </Text>
                    </span>
                </span>
            </div>
        </div>
        <div className='cashier__form-submit'>
            {!is_from_derivgo && (
                <Button
                    className='cashier__form-submit-button'
                    has_effect
                    text={localize('View in statement')}
                    onClick={() => openStatement(history, resetPaymentAgentTransfer)}
                    secondary
                    large
                />
            )}
            <Button
                className='cashier__form-submit-button cashier__done-button'
                has_effect
                text={localize('Make a new transfer')}
                onClick={resetPaymentAgentTransfer}
                primary
                large
            />
        </div>
    </div>
);

export default withRouter(
    connect(({ client, common, modules }: RootStore) => ({
        currency: client.currency,
        is_from_derivgo: common.is_from_derivgo,
        loginid: client.loginid,
        receipt: modules.cashier.payment_agent_transfer.receipt,
        resetPaymentAgentTransfer: modules.cashier.payment_agent_transfer.resetPaymentAgentTransfer,
    }))(PaymentAgentTransferReceipt)
);
