import React, { ComponentProps, useState } from 'react';
import { TransactionsCrypto, TransactionsFilter } from '../../modules';
import './WalletTransactions.scss';

const WalletTransactions = () => {
    const [filterValue, setFilterValue] = useState<ComponentProps<typeof TransactionsCrypto>['filter']>(undefined);
    const [isPendingActive, setIsPendingActive] = useState(true);

    return (
        <div className='wallets-transactions'>
            <div className='wallets-transactions__header'>
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
                <TransactionsFilter isPendingActive={isPendingActive} onSelect={setFilterValue} />
            </div>
            {isPendingActive ? <TransactionsCrypto filter={filterValue} /> : null}
        </div>
    );
};

export default WalletTransactions;
