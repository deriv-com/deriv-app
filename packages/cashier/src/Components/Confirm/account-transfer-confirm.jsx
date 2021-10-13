import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import { getAccountText } from '_common/utility';
import Confirm from '../confirm.jsx';

const AccountTransferConfirm = ({
    error,
    account_transfer_amount,
    requestTransferBetweenAccounts,
    selected_from,
    selected_to,
    setIsTransferConfirm,
}) => (
    <Confirm
        data={[
            {
                key: 'transfer-from',
                label: localize('Transfer from'),
                value: [selected_from.text, selected_from.value],
            },
            {
                key: 'transfer-to',
                label: localize('Transfer to'),
                value: [getAccountText(selected_to), selected_to.value],
            },
            {
                key: 'amount',
                label: localize('Amount'),
                value: <Money currency={selected_from.currency} amount={account_transfer_amount} show_currency />,
            },
        ]}
        error={error}
        header={localize('Please confirm the transaction details in order to complete the transfer:')}
        onClickBack={() => {
            setIsTransferConfirm(false);
        }}
        onClickConfirm={() => {
            requestTransferBetweenAccounts({ amount: +account_transfer_amount });
        }}
    />
);

AccountTransferConfirm.propTypes = {
    requestPaymentAgentTransfer: PropTypes.func,
    setIsTryTransferSuccessful: PropTypes.func,
};

export default connect(({ modules }) => ({
    error: modules.cashier.account_transfer_store.error,
    selected_from: modules.cashier.account_transfer_store.selected_from,
    selected_to: modules.cashier.account_transfer_store.selected_to,
    account_transfer_amount: modules.cashier.account_transfer_store.account_transfer_amount,
    requestTransferBetweenAccounts: modules.cashier.account_transfer_store.requestTransferBetweenAccounts,
    setIsTransferConfirm: modules.cashier.account_transfer_store.setIsTransferConfirm,
    transfer_to: modules.cashier.payment_agent_transfer_store.confirm.client_id,
}))(AccountTransferConfirm);
