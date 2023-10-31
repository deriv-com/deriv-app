import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useTransactions } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';
import { Loader } from '../../../../../../components';
import { TransactionsCompletedRow } from '../TransactionsCompletedRow';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsCompleted.scss';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

type TProps = {
    filter?: TFilter;
};

const TransactionsCompleted: React.FC<TProps> = ({ filter }) => {
    const { data: transactions, fetchNextPage, isFetching, isLoading, setFilter } = useTransactions();

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { clientHeight, scrollHeight, scrollTop } = containerRefElement;
                //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
                if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching]
    );

    useEffect(() => {
        setFilter(filter);
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!transactions && (isFetching || isLoading)) return <Loader />;

    if (!transactions) return <TransactionsNoDataState />;

    return (
        <TransactionsTable
            columns={[
                {
                    accessorFn: row => row.transaction_time && moment.unix(row.transaction_time).format('DD MMM YYYY'),
                    accessorKey: 'date',
                    header: 'Date',
                },
            ]}
            data={transactions}
            fetchMore={fetchMoreOnBottomReached}
            groupBy={['date']}
            rowGroupRender={transaction => (
                <p className='wallets-transactions-completed__group-title'>
                    {transaction.transaction_time && moment.unix(transaction.transaction_time).format('DD MMM YYYY')}
                </p>
            )}
            rowRender={transaction => <TransactionsCompletedRow transaction={transaction} />}
        />
    );
};

export default TransactionsCompleted;
