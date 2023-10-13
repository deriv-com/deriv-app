import React, { ComponentProps, useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import {
    WalletTransactionsCompleted,
    WalletTransactionsFilter,
    WalletTransactionsPending,
} from '../../screens/WalletTransactionsScreens';
import './WalletTransactions.scss';

type TWalletTransactionsPendingFilter = ComponentProps<typeof WalletTransactionsPending>['filter'];
type TWalletTransactionCompletedFilter = ComponentProps<typeof WalletTransactionsCompleted>['filter'];
type TFilterValue = TWalletTransactionCompletedFilter | TWalletTransactionsPendingFilter;

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

const WalletTransactions = () => {
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
                <WalletTransactionsFilter isPendingActive={isPendingActive} onSelect={setFilterValue} />
            </div>
            {isPendingActive ? (
                <WalletTransactionsPending
                    filter={filtersMapper.pending[filterValue] as TWalletTransactionsPendingFilter}
                />
            ) : (
                <WalletTransactionsCompleted
                    filter={filtersMapper.completed[filterValue] as TWalletTransactionCompletedFilter}
                />
            )}
        </div>
    );
};

export default WalletTransactions;
