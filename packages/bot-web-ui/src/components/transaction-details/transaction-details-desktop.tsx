import React, { useEffect, useState } from 'react';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import Draggable from 'Components/draggable';
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
    { key: 'total_payout', label: localize('Total payout') },
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

    const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });

    const handleResize = () => {
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        setScreenDimensions({ width: window.innerWidth, height: window.innerHeight });

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Calculate xaxis and yaxis to center the modal on open
    const modalWidth = 1034;
    const modalHeight = 800;
    const xaxis = (screenDimensions.width - modalWidth) / 2;
    const yAxisValue = (screenDimensions.height - modalHeight) / 2;
    const yaxis = yAxisValue >= 0 ? yAxisValue : 0;

    return (
        <Draggable
            bounds='.dashboard__main'
            dragHandleClassName='react-rnd-wrapper-header'
            is_visible={is_transaction_details_modal_open}
            minWidth={modalWidth}
            onCloseDraggable={() => toggleTransactionDetailsModal(false)}
            width={modalWidth}
            xaxis={xaxis}
            yaxis={yaxis}
            header_title={'Transactions detailed summary'}
        >
            <DesktopTransactionTable
                transaction_columns={transaction_columns}
                transactions={elements}
                result_columns={result_columns}
                result={statistics}
            />
        </Draggable>
    );
});

export default TransactionDetailsDesktop;
