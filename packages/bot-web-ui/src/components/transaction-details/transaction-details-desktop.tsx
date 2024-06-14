import React from 'react';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import DraggableResizeWrapper from 'Components/draggable/draggable-resize-wrapper';
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
    { key: 'account', label: localize('Account'), extra_class: '--grow-mid' },
    { key: 'no_of_runs', label: localize('No. of runs') },
    { key: 'total_stake', label: localize('Total stake') },
    { key: 'total_payout', label: localize('Total payout') },
    { key: 'win', label: localize('Win') },
    { key: 'loss', label: localize('Loss') },
    { key: 'total_profit', label: localize('Total profit/loss') },
    { key: 'balance', label: localize('Balance') },
];

const TransactionDetailsDesktop = observer(() => {
    const { client } = useStore();
    const { loginid, balance } = client;
    const { transactions } = useDBotStore();
    const {
        toggleTransactionDetailsModal,
        is_transaction_details_modal_open,
        transactions: transaction_list,
    }: Partial<TTransactionStore> = transactions;
    const { statistics }: Partial<TRunPanelStore> = transactions;

    return (
        <React.Fragment>
            {is_transaction_details_modal_open && (
                <DraggableResizeWrapper
                    boundary='.main'
                    header={localize('Transactions detailed summary')}
                    onClose={() => toggleTransactionDetailsModal(false)}
                    modalWidth={882}
                    modalHeight={404}
                    minWidth={882}
                    minHeight={404}
                    enableResizing
                >
                    <DesktopTransactionTable
                        transaction_columns={transaction_columns}
                        transactions={transaction_list}
                        result_columns={result_columns}
                        result={statistics}
                        account={loginid ?? ''}
                        balance={balance ?? 0}
                    />
                </DraggableResizeWrapper>
            )}
        </React.Fragment>
    );
});

export default TransactionDetailsDesktop;
