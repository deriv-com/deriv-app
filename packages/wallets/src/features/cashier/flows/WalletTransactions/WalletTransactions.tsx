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
    const [filterValue, setFilterValue] = useState<TFilterValue>();

    useEffect(() => {
        if (!data?.currency_config?.is_crypto && isPendingActive) {
            setIsPendingActive(false);
        }
    }, [data?.currency_config?.is_crypto, isPendingActive]);

    useEffect(() => {
        if (isPendingActive && filterValue && !Object.values(filtersMapper.pending).includes(filterValue)) {
            setFilterValue(filtersMapper.pending.all);
        } else if (!isPendingActive && filterValue && !Object.values(filtersMapper.completed).includes(filterValue)) {
            setFilterValue(filtersMapper.completed.all);
        }
    }, [isPendingActive]); // eslint-disable-line react-hooks/exhaustive-deps

    const onFilterSelect = (value: string) => {
        if (isPendingActive) {
            setFilterValue(filtersMapper.pending[value]);
        } else {
            setFilterValue(filtersMapper.completed[value]);
        }
    };

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
                <WalletTransactionsFilter isPendingActive={isPendingActive} onSelect={onFilterSelect} />
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
