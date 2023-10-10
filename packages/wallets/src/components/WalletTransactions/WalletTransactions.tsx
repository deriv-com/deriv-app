import React, { ComponentProps, useEffect, useState } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletTransactionsCrypto } from '../WalletTransactionsCrypto';
import { WalletTransactionsFilter } from '../WalletTransactionsFilter';
import { WalletTransactionsGeneral } from '../WalletTransactionsGeneral';
import './WalletTransactions.scss';

type TWalletTransactionCryptoFilter = ComponentProps<typeof WalletTransactionsCrypto>['filter'];
type TWalletTransactionGeneralFilter = ComponentProps<typeof WalletTransactionsGeneral>['filter'];

const WalletTransactions = () => {
    const { data } = useActiveWalletAccount();
    const [isPendingActive, setIsPendingActive] = useState(false);
    const [filterValue, setFilterValue] = useState<TWalletTransactionCryptoFilter | TWalletTransactionGeneralFilter>();

    useEffect(() => {
        if (isPendingActive && filterValue === 'transfer') {
            setFilterValue('all');
        }
        if (!isPendingActive && filterValue === 'all') {
            setFilterValue(undefined);
        }
    }, [filterValue, isPendingActive]);

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
                <WalletTransactionsCrypto filter={filterValue as TWalletTransactionCryptoFilter} />
            ) : (
                <WalletTransactionsGeneral filter={filterValue as TWalletTransactionGeneralFilter} />
            )}
        </div>
    );
};

export default WalletTransactions;
