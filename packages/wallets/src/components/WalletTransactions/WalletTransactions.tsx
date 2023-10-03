import React, { ComponentProps } from 'react';
import { WalletTransactionsCrypto } from '../WalletTransactionsCrypto';
import { WalletTransactionsFilter } from '../WalletTransactionsFilter';
import './WalletTransactions.scss';

const WalletTransactions = () => {
    const [filterValue, setFilterValue] =
        React.useState<ComponentProps<typeof WalletTransactionsCrypto>['filter']>(undefined);
    const [isPendingActive, setIsPendingActive] = React.useState(true);

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
                <WalletTransactionsFilter isPendingActive={isPendingActive} onSelect={setFilterValue} />
            </div>
            {isPendingActive ? <WalletTransactionsCrypto filter={filterValue} /> : null}
        </div>
    );
};

export default WalletTransactions;
