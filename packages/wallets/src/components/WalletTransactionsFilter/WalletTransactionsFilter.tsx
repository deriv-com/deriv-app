import React, { ComponentProps, useMemo } from 'react';
import { WalletTransactionsCrypto } from '../WalletTransactionsCrypto';
import { WalletTransactionsGeneral } from '../WalletTransactionsGeneral';
import './WalletTransactionsFilter.scss';

type TValue =
    | ComponentProps<typeof WalletTransactionsCrypto>['filter']
    | ComponentProps<typeof WalletTransactionsGeneral>['filter'];

type TProps = {
    isPendingActive: boolean;
    onSelect: (value: TValue) => void;
};

const WalletTransactionsFilter: React.FC<TProps> = ({ isPendingActive, onSelect }) => {
    const optionsSelectionMapper: Record<string, Partial<TValue>> = useMemo(
        () => ({
            all: isPendingActive ? 'all' : undefined,
            deposit: 'deposit',
            transfer: 'transfer',
            withdrawal: 'withdrawal',
        }),
        [isPendingActive]
    );

    return (
        <div className='wallets-transactions-filter'>
            <select
                onChange={e => onSelect(optionsSelectionMapper[e.target.value as keyof typeof optionsSelectionMapper])}
            >
                <option value='all'>All</option>
                <option value='deposit'>Deposit</option>
                <option value='withdrawal'>Withdrawal</option>
                {!isPendingActive && <option value='transfer'>Transfer</option>}
            </select>
        </div>
    );
};

export default WalletTransactionsFilter;
