import React, { useEffect } from 'react';
import { useCryptoTransactions } from '@deriv/api-v2';
import { Loader, Text } from '@deriv-com/ui';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsPendingRow } from '../TransactionsPendingRow';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsPending.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const formatUnixDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
    const options = { day: '2-digit', month: 'short', year: 'numeric' } as const;
    return date.toLocaleDateString('en-GB', options);
};

const TransactionsPending: React.FC<TProps> = ({ filter = 'all' }) => {
    const { data: transactions, isLoading, isSubscribed, resetData, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        resetData();
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, resetData, subscribe, unsubscribe]);

    if (!isSubscribed || isLoading) return <Loader />;

    if (!transactions) return <TransactionsNoDataState />;

    return (
        <div className='wallets-transactions-pending'>
            <TransactionsTable
                columns={[
                    {
                        accessorFn: row => formatUnixDate(row.submit_date),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={transactions}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <div className='wallets-transactions-pending__group-title'>
                        <Text color='primary' size='2xs'>
                            {transaction.submit_date && formatUnixDate(transaction.submit_date)}
                        </Text>
                    </div>
                )}
                rowRender={transaction => <TransactionsPendingRow transaction={transaction} />}
            />
        </div>
    );
};

export default TransactionsPending;
