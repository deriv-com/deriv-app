import React, { useEffect } from 'react';
import moment from 'moment';
import { useCryptoTransactions } from '@deriv/api';
import { Loader } from '../Loader';
import { WalletTransactionsCryptoRow } from '../WalletTransactionsCryptoRow';
import { WalletTransactionsNoDataState } from '../WalletTransactionsNoDataState';
import { WalletTransactionsTable } from '../WalletTransactionsTable';
import './WalletTransactionsCrypto.scss';

type TProps = {
    filter?: NonNullable<
        NonNullable<NonNullable<Parameters<ReturnType<typeof useCryptoTransactions>['subscribe']>>[0]>['payload']
    >['transaction_type'];
};

const WalletTransactionsCrypto: React.FC<TProps> = ({ filter }) => {
    const { data, isLoading, subscribe, unsubscribe } = useCryptoTransactions();

    useEffect(() => {
        subscribe({ payload: { transaction_type: filter } });

        return () => unsubscribe();
    }, [filter, subscribe, unsubscribe]);

    if (isLoading) return <Loader />;

    if (!data) return <WalletTransactionsNoDataState />;

    return (
        <div className='wallets-transactions-crypto'>
            <WalletTransactionsTable
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
                rowRender={transaction => <WalletTransactionsCryptoRow transaction={transaction} />}
            />
        </div>
    );
};

export default WalletTransactionsCrypto;
