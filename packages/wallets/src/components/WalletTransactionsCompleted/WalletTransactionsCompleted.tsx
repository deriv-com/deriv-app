import React, { useCallback, useEffect } from 'react';
import moment from 'moment';
import { useAuthorize, useInvalidateQuery, useTransactions } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';
import { WalletTransactionsCompletedRow } from '../WalletTransactionsCompletedRow';
import { WalletTransactionsNoDataState } from '../WalletTransactionsNoDataState';
import { WalletTransactionsTable } from '../WalletTransactionsTable';

type TFilter = NonNullable<TSocketRequestPayload<'statement'>['payload']>['action_type'];

type TProps = {
    filter?: TFilter;
    setFilter: (value?: TFilter) => void;
};

const filtersMapper: Record<string, Partial<TProps['filter']>> = {
    all: undefined,
    deposit: 'deposit',
    transfer: 'transfer',
    withdrawal: 'withdrawal',
};

const WalletTransactionsCompleted: React.FC<TProps> = ({ filter, setFilter }) => {
    const { isFetching: isAuthorizeFetching } = useAuthorize();
    const invalidate = useInvalidateQuery();
    const { data, fetchNextPage, isFetching, setFilter: setTransactionsFilter } = useTransactions();

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
        setFilter(filtersMapper[filter || 'all']);
        setTransactionsFilter(filtersMapper[filter || 'all']);
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!isAuthorizeFetching) {
            invalidate('statement');
        }
    }, [invalidate, isAuthorizeFetching]);

    if (!data) return <WalletTransactionsNoDataState />;

    return (
        <div>
            <WalletTransactionsTable
                columns={[
                    {
                        accessorFn: row =>
                            row.transaction_time && moment.unix(row.transaction_time).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={data}
                fetchMore={fetchMoreOnBottomReached}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <p className='wallets-transactions-crypto__group-title'>
                        {transaction.transaction_time &&
                            moment.unix(transaction.transaction_time).format('DD MMM YYYY')}
                    </p>
                )}
                rowRender={transaction => <WalletTransactionsCompletedRow transaction={transaction} />}
            />
        </div>
    );
};

export default WalletTransactionsCompleted;
