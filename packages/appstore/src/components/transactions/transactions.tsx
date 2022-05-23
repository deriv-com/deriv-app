import * as React from 'react';
import { StatementResponse } from '@deriv/api-types';
import { InfiniteDataList, Loading } from '@deriv/components';
import { toMoment, useIsMounted } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import EmptyState from 'Components/empty-state';
import { useWs } from 'Services/websocket';
import TransactionsHeader from './transactions-header';
import TransactionsItemHeader from './transactions-item-header';
import TransactionsItemTransaction from './transactions-item-transaction';
import { TTransactionActionType, TStatementTransaction } from './transactions.types';

type TListItem = {
    id: number | undefined;
    component: React.ElementType;
};

// eslint-disable-next-line no-shadow
enum TransactionItemType {
    header,
    transaction,
}

type TTransactionItemHeader = TListItem & {
    transaction_date: string;
    type: TransactionItemType.header;
};

type TTransactionItemTransaction = TListItem & {
    transaction: TStatementTransaction;
    type: TransactionItemType.transaction;
};

type TTransactionItem = TTransactionItemHeader | TTransactionItemTransaction;

type TState = {
    items: TStatementTransaction[];
    has_more_items: boolean;
    is_loading: boolean;
    has_finished_initial_load: boolean;
    selected_filter: TTransactionActionType;
};

type TUpdatedStateValues = {
    [key in keyof Partial<TState>]: Partial<TState>[key];
};

const Transactions: React.FC = () => {
    const FETCH_LIMIT = 100;
    const isMounted = useIsMounted();
    const ws = useWs();

    const stateReducer = (current_state: TState, updated_values: TUpdatedStateValues) => ({
        ...current_state,
        ...updated_values,
    });

    const [state, setState] = React.useReducer(stateReducer, {
        has_finished_initial_load: false,
        has_more_items: false,
        items: [],
        is_loading: false,
        selected_filter: undefined,
    });

    React.useEffect(() => {
        setState({
            has_finished_initial_load: false,
            is_loading: true,
        });

        loadMoreTransactions({ startIndex: 0 }, true);

        // Ignored below warning as "loadMoreTransactions" will not be changing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.selected_filter]);

    const onFilterChange = (value: TTransactionActionType) => setState({ selected_filter: value });

    const generateListItems = (): TTransactionItem[] => {
        const list_items: TTransactionItem[] = [];

        state.items
            // Sorts in reverse chronological order.
            .sort((a, b) => (a.transaction_time && b.transaction_time ? b.transaction_time + a.transaction_time : 0))
            .forEach(item => {
                // Filters out unsupported transaction types.
                if (item.action_type && !['deposit', 'withdrawal', 'transfer'].includes(item.action_type)) return;

                let should_add_header = true;
                const curr_transaction_item_moment = toMoment(item.transaction_time);

                if (list_items.length > 0) {
                    const previous_item = list_items[list_items.length - 1];

                    if (previous_item.type === TransactionItemType.transaction) {
                        const prev_transaction_item_moment = toMoment(previous_item.transaction.transaction_time);

                        if (curr_transaction_item_moment.diff(prev_transaction_item_moment, 'days') === 0) {
                            should_add_header = false;
                        }
                    }
                }

                if (should_add_header) {
                    list_items.push({
                        id: curr_transaction_item_moment.format('DDMMYYYY'),
                        component: TransactionsItemHeader,
                        transaction_date: curr_transaction_item_moment.format('DD MMM YYYY'),
                        type: TransactionItemType.header,
                    });
                }

                list_items.push({
                    id: item.transaction_id,
                    component: TransactionsItemTransaction,
                    transaction: item,
                    type: TransactionItemType.transaction,
                });
            });

        return list_items;
    };

    const loadMoreTransactions = ({ startIndex }: { startIndex: number }, should_reset = false) =>
        new Promise<void>(resolve => {
            ws.authorized
                .statement(FETCH_LIMIT, startIndex, {
                    action_type: state.selected_filter === 'all' ? undefined : state.selected_filter,
                })
                .then((response: StatementResponse) => {
                    if (!isMounted()) return;
                    if (response.error) {
                        setState({
                            has_finished_initial_load: true,
                            has_more_items: false,
                            is_loading: false,
                            items: [],
                        });
                    } else if (response.statement?.transactions) {
                        const { transactions } = response.statement;
                        const updated_items = should_reset ? [] : [...state.items];

                        transactions.forEach(transaction => {
                            const old_item_idx = updated_items.findIndex(
                                item => item.transaction_id === transaction.transaction_id
                            );

                            if (old_item_idx > -1) {
                                updated_items[old_item_idx] = transaction;
                            } else {
                                updated_items.push(transaction);
                            }
                        });

                        setState({
                            has_finished_initial_load: true,
                            has_more_items: transactions.length >= FETCH_LIMIT,
                            is_loading: false,
                            items: updated_items,
                        });
                    } else {
                        setState({
                            has_finished_initial_load: true,
                            is_loading: false,
                        });
                    }

                    resolve();
                });
        });

    return (
        <div className='dw-transactions'>
            <TransactionsHeader selected_filter={state.selected_filter} onFilterChange={onFilterChange} />
            <div className='dw-transactions__transactions'>
                {state.is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <React.Fragment>
                        {state.has_finished_initial_load && state.items.length === 0 ? (
                            <EmptyState
                                icon_name='IcWalletTransactionsEmpty'
                                renderTitle={() => <Localize i18n_default_text='No transactions' />}
                                renderMessage={() => (
                                    <Localize i18n_default_text='Your transactions will appear here' />
                                )}
                            />
                        ) : (
                            <InfiniteDataList
                                items={generateListItems()}
                                keyMapperFn={(item: TTransactionItem) => `${item.id}`}
                                rowRenderer={({ row }: { row: TTransactionItem }) => <row.component {...row} />}
                                loadMoreRowsFn={loadMoreTransactions}
                                has_more_items_to_load={state.has_more_items}
                                overscanRowCount={10}
                            />
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default Transactions;
