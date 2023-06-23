import React from 'react';
import { Dialog } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import DesktopTransactionTable from './desktop-transaction-table';
import { TColumn, TRunPanelStore, TTransactionStore } from './transaction-details.types';
import './transaction-details-desktop.scss';

const transaction_columns: TColumn[] = [
    { key: 'timestamp', label: localize('Timestamp'), extra_class: '--grow-big' },
    { key: 'reference', label: localize('Reference'), extra_class: '--grow-mid' },
    { key: 'market', label: localize('Market') },
    { key: 'contract_type', label: localize('Trade type') },
    { key: 'entry_tick', label: localize('Entry spot') },
    { key: 'exit_tick', label: localize('Exit spot') },
    { key: 'buy_price', label: localize('Buy price') },
    { key: 'profit', label: localize('Profit/Loss') },
];

/* TODO: Add back account & balance when we have support from transaction store */
const result_columns: TColumn[] = [
    // { key: 'account', label: localize('Account') },
    { key: 'no_of_runs', label: localize('No. of runs') },
    { key: 'total_stake', label: localize('Total stake') },
    { key: 'total_payout    ', label: localize('Total payout') },
    { key: 'win', label: localize('Win') },
    { key: 'loss', label: localize('Loss') },
    { key: 'total_profit', label: localize('Total profit/loss') },
    // { key: 'balance', label: localize('Balance') },
];

const TransactionDetailsDesktop = observer(() => {
    const { transactions, run_panel } = useDBotStore();
    const { toggleTransactionDetailsModal, is_transaction_details_modal_open, elements }: Partial<TTransactionStore> =
        transactions;
    const { statistics }: Partial<TRunPanelStore> = run_panel;
    return (
        <Dialog
            cancel_button_text=''
            className='transaction-details-modal-desktop'
            confirm_button_text=''
            has_close_icon
            is_mobile_full_width
            is_visible={is_transaction_details_modal_open}
            onClose={() => {
                toggleTransactionDetailsModal(false);
            }}
            portal_element_id='modal_root'
            title={localize('Transactions detailed summary')}
        >
            <DesktopTransactionTable
                transaction_columns={transaction_columns}
                transactions={elements}
                result_columns={result_columns}
                result={statistics}
            />
        </Dialog>
    );
});

export default TransactionDetailsDesktop;
