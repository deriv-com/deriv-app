import React, { useEffect } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { Loader } from '../../../../../../components/Loader';
import { TransactionsCryptoRow } from '../TransactionsCryptoRow';
import { TransactionsNoDataState } from '../TransactionsNoDataState';
import { TransactionsTable } from '../TransactionsTable';
import './TransactionsCrypto.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const TransactionsCrypto: React.FC<TProps> = ({ filter }) => {
    const { data, isLoading, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, subscribe, unsubscribe]);

    if (isLoading) return <Loader />;

    if (!data) return <TransactionsNoDataState />;

    return (
        <div className='wallets-transactions-crypto'>
            <TransactionsTable
                columns={[
                    {
                        accessorFn: row => moment(row.submit_date).format('DD MMM YYYY'),
                        accessorKey: 'date',
                        header: 'Date',
                    },
                ]}
                data={data}
                groupBy={['date']}
                rowGroupRender={transaction => (
                    <p className='wallets-transactions-crypto__group-title'>
                        {moment(transaction.submit_date).format('DD MMM YYYY')}
                    </p>
                )}
                rowRender={transaction => <TransactionsCryptoRow transaction={transaction} />}
            />
        </div>
    );
};

export default TransactionsCrypto;
