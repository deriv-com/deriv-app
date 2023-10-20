import React, { ComponentProps, useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { TransactionsCompleted, TransactionsFilter, TransactionsPending } from './components';
import './Transactions.scss';

type TTransactionsPendingFilter = ComponentProps<typeof TransactionsPending>['filter'];
type TTransactionCompletedFilter = ComponentProps<typeof TransactionsCompleted>['filter'];
type TFilterValue = TTransactionCompletedFilter | TTransactionsPendingFilter;

const filtersMapper: Record<string, Record<string, TFilterValue>> = {
    completed: {
        all: undefined,
        deposit: 'deposit',
        transfer: 'transfer',
        withdrawal: 'withdrawal',
    },
    pending: {
        all: 'all',
        deposit: 'deposit',
        withdrawal: 'withdrawal',
    },
};

const Transactions = () => {
    const { data } = useActiveWalletAccount();
    const [isPendingActive, setIsPendingActive] = useState(false);
    const [filterValue, setFilterValue] = useState('all');

    useEffect(() => {
        if (!data?.currency_config?.is_crypto && isPendingActive) {
            setIsPendingActive(false);
        }
    }, [data?.currency_config?.is_crypto, isPendingActive]);

    useEffect(() => {
        if (isPendingActive && !Object.keys(filtersMapper.pending).includes(filterValue)) {
            setFilterValue('all');
        }
        if (!isPendingActive && !Object.keys(filtersMapper.completed).includes(filterValue)) {
            setFilterValue('all');
        }
    }, [filterValue, isPendingActive]); // eslint-disable-line react-hooks/exhaustive-deps

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
                <TransactionsFilter isPendingActive={isPendingActive} onSelect={setFilterValue} />
            </div>
            {isPendingActive ? (
                <TransactionsPending filter={filtersMapper.pending[filterValue] as TTransactionsPendingFilter} />
            ) : (
                <TransactionsCompleted filter={filtersMapper.completed[filterValue] as TTransactionCompletedFilter} />
            )}
        </div>
    );
};

export default Transactions;
