import React, { useEffect } from 'react';
import { useCryptoTransactions } from '@deriv/api-v2';
import { Loader, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
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
                        accessorFn: row =>
                            FormatUtils.getFormattedDateString(row.submit_date, {
                                dateOptions: { day: '2-digit', month: 'short', year: 'numeric' },
                                format: 'DD MMM YYYY',
                                unix: true,
                            }),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={transactions}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <div className='wallets-transactions-pending__group-title'>
                        <Text color='primary' size='2xs'>
                            {transaction.submit_date &&
                                FormatUtils.getFormattedDateString(transaction.submit_date, {
                                    dateOptions: { day: '2-digit', month: 'short', year: 'numeric' },
                                    format: 'DD MMM YYYY',
                                    unix: true,
                                })}
                        </Text>
                    </div>
                )}
                rowRender={transaction => <TransactionsPendingRow transaction={transaction} />}
            />
        </div>
    );
};

export default TransactionsPending;
