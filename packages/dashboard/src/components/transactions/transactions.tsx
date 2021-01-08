import * as React from 'react';
import { InfiniteDataList, Loading, Text } from '@deriv/components';
import { toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Transaction, StatementResponse } from '@deriv/api-types';
import EmptyState from 'Components/empty-state';
import { useStores } from 'Stores';
import TransactionsHeader from './transactions-header';
import TransactionsTransaction from './transactions-transaction';

const Transactions: React.FC<TTransactionsProps> = () => {
    const FETCH_LIMIT = 100;
    const { ws } = useStores();
    const [is_loading, setIsLoading] = React.useState(true);
    const [has_finished_initial_load, setHasFinishedInitialLoad] = React.useState(false);
    const [state, setState] = React.useState<{ items: TTransactionItem[]; has_more_items: boolean }>({
        items: [],
        has_more_items: false,
    });

    /**
     * @param {Transaction[]} collection Input array
     * @param {Transaction} transaction Current transaction
     * @return {TTransactionItem[]} New array containing both transactions and transaction headers.
     */
    const transactionsReducer = (collection: TTransactionItem[], transaction: Transaction) => {
        let should_add_header = true;

        const curr_item_transaction_moment = toMoment(transaction.transaction_time);
        const previous_item = collection[collection.length - 1];

        if (previous_item?.transaction?.transaction_time) {
            const prev_item_transaction_moment = toMoment(previous_item.transaction.transaction_time);

            if (curr_item_transaction_moment.diff(prev_item_transaction_moment, 'days') === 0) {
                should_add_header = false;
            }
        }

        if (should_add_header) {
            collection.push({
                id: curr_item_transaction_moment.format('DDMMYYYY'),
                component: TransactionsHeader,
                transaction_time: curr_item_transaction_moment.format('DD MMM YYYY'),
            });
        }

        collection.push({
            id: transaction.transaction_id,
            component: TransactionsTransaction,
            transaction,
        });

        return collection;
    };

    const loadMoreTransactions = ({ startIndex }: { startIndex: number }) => {
        return new Promise<void>(resolve => {
            ws.authorized.statement('FETCH_LIMIT', startIndex).then((response: StatementResponse) => {
                if (response.statement?.transactions) {
                    const { transactions } = response.statement;

                    setState({
                        items: transactions.reduce(transactionsReducer, [...state.items]),
                        has_more_items: transactions.length >= FETCH_LIMIT,
                    });
                }

                setHasFinishedInitialLoad(true);
                setIsLoading(false);
                resolve();
            });
        });
    };

    React.useEffect(() => {
        loadMoreTransactions({ startIndex: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_loading) {
        return (
            <div className='dw-transactions'>
                <Loading is_fullscreen={false} />
            </div>
        );
    }

    if (has_finished_initial_load && state.items.length === 0) {
        return (
            <div className='dw-transactions'>
                <EmptyState
                    icon_name='IcWalletTransactionsEmpty'
                    renderTitle={() => <Localize i18n_default_text='No transactions' />}
                    renderMessage={() => <Localize i18n_default_text='Your transactions will appear here' />}
                />
            </div>
        );
    }

    return (
        <div className='dw-transactions'>
            <div className='dw-transactions__header'>
                <Text as='p' color='prominent' size='s' line_height='m' weight='bold'>
                    <Localize i18n_default_text='Transactions' />
                </Text>
            </div>
            <div className='dw-transactions__transactions'>
                <InfiniteDataList
                    items={state.items}
                    keyMapperFn={(item: TTransactionItem) => `${item.id}`}
                    rowRenderer={({ row }: { row: TTransactionItem }) => <row.component {...row} />}
                    loadMoreRowsFn={loadMoreTransactions}
                    has_more_items_to_load={state.has_more_items}
                />
            </div>
        </div>
    );
};

type TTransactionsProps = {
    transactions: Transaction[];
};

type TTransactionItem = {
    id: number | undefined;
    component: React.ElementType;
    transaction?: Transaction;
    transaction_time?: string;
};

export default Transactions;
