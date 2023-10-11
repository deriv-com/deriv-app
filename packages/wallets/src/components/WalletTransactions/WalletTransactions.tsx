import React, { ComponentProps, useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletTransactionsCompleted } from '../WalletTransactionsCompleted';
import { WalletTransactionsFilter } from '../WalletTransactionsFilter';
import { WalletTransactionsPending } from '../WalletTransactionsPending';
import './WalletTransactions.scss';

type TWalletTransactionsPendingFilter = ComponentProps<typeof WalletTransactionsPending>['filter'];
type TWalletTransactionCompletedFilter = ComponentProps<typeof WalletTransactionsCompleted>['filter'];

const WalletTransactions = () => {
    const { data } = useActiveWalletAccount();
    const [isPendingActive, setIsPendingActive] = useState(false);
    const [filterValue, setFilterValue] = useState<
        TWalletTransactionCompletedFilter | TWalletTransactionsPendingFilter
    >();

    useEffect(() => {
        if (isPendingActive && filterValue === 'transfer') {
            setFilterValue('all');
        }
        if (!isPendingActive && filterValue === 'all') {
            setFilterValue(undefined);
        }
    }, [filterValue, isPendingActive]);

    useEffect(() => {
        if (!data?.currency_config?.is_crypto && isPendingActive) {
            setIsPendingActive(false);
        }
    }, [data?.currency_config?.is_crypto, isPendingActive]);

    return (
        <div className='wallets-transactions'>
            <div className='wallets-transactions__header'>
                {data?.currency_config?.is_crypto && (
                    <div className='wallets-transactions__toggle'>
                        <p>Pending Transactions</p>
                        <input
                            checked={isPendingActive}
                            className='wallets-transactions__toggle-switch'
                            id='toggle-pending'
                            onChange={() => setIsPendingActive(!isPendingActive)}
                            type='checkbox'
                        />
                        <label className='wallets-transactions__toggle-switch__label' htmlFor='toggle-pending'>
                            <span className='wallets-transactions__toggle-switch__button' />
                        </label>
                    </div>
                )}
                <WalletTransactionsFilter isPendingActive={isPendingActive} onSelect={setFilterValue} />
            </div>
            {isPendingActive ? (
                <WalletTransactionsPending filter={filterValue as TWalletTransactionsPendingFilter} />
            ) : (
                <WalletTransactionsCompleted filter={filterValue as TWalletTransactionCompletedFilter} />
            )}
        </div>
    );
};

export default WalletTransactions;
