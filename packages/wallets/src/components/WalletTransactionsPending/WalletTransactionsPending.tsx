import React, { useEffect } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { Loader } from '../Loader';
import { WalletTransactionsNoDataState } from '../WalletTransactionsNoDataState';
import { WalletTransactionsPendingRow } from '../WalletTransactionsPendingRow';
import { WalletTransactionsTable } from '../WalletTransactionsTable';
import './WalletTransactionsPending.scss';

type TFilter = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
>['transaction_type'];

type TProps = {
    filter?: TFilter;
    setFilter: (value?: TFilter) => void;
};

const acceptableFilters = ['all', 'deposit', 'withdrawal'];

const WalletTransactionsPending: React.FC<TProps> = ({ filter, setFilter }) => {
    const { data, isLoading, resetData, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        resetData();
        if (filter && !acceptableFilters.includes(filter)) {
            setFilter('all');
        }
        subscribe({ payload: { transaction_type: filter && acceptableFilters.includes(filter) ? filter : 'all' } });
        return () => unsubscribe();
    }, [filter, resetData, setFilter, subscribe, unsubscribe]);

    if (isLoading) return <Loader />;

    if (!data) return <WalletTransactionsNoDataState />;

    return (
        <div className='wallets-transactions-pending'>
            <WalletTransactionsTable
                columns={[
                    {
                        accessorFn: row => moment.unix(row.submit_date).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={data}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <p className='wallets-transactions-pending__group-title'>
                        {moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                    </p>
                )}
                rowRender={transaction => <WalletTransactionsPendingRow transaction={transaction} />}
            />
        </div>
    );
};

export default WalletTransactionsPending;
