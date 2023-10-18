import React, { useEffect } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { WalletTransactionsNoDataState } from '../WalletTransactionsNoDataState';
import { WalletTransactionsPendingRow } from '../WalletTransactionsPendingRow';
import { WalletTransactionsTable } from '../WalletTransactionsTable';
import './WalletTransactionsPending.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const WalletTransactionsPending: React.FC<TProps> = ({ filter = 'all' }) => {
    const { data, resetData, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        resetData();
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, resetData, subscribe, unsubscribe]);

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
