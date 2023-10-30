import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { Loader } from '../../../../../../components';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsPendingRow } from '../TransactionsPendingRow';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsPending.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const TransactionsPending: React.FC<TProps> = ({ filter = 'all' }) => {
    const { data: transactions, isLoading, isSubscribed, resetData, subscribe, unsubscribe } = useCryptoTransactions();
    const [shouldShowLoader, setShouldShowLoader] = useState(true);

    useEffect(() => {
        setShouldShowLoader(true);
        resetData();
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, resetData, subscribe, unsubscribe]);

    useEffect(() => {
        if (isSubscribed && !isLoading) {
            setShouldShowLoader(false);
        }
    }, [isLoading, isSubscribed]);

    if (shouldShowLoader) return <Loader />;

    if (!transactions) return <TransactionsNoDataState />;

    return (
        <div className='wallets-transactions-pending'>
            <TransactionsTable
                columns={[
                    {
                        accessorFn: row => moment.unix(row.submit_date).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={transactions}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <p className='wallets-transactions-pending__group-title'>
                        {moment.unix(transaction.submit_date).format('DD MMM YYYY')}
                    </p>
                )}
                rowRender={transaction => <TransactionsPendingRow transaction={transaction} />}
            />
        </div>
    );
};

export default TransactionsPending;
