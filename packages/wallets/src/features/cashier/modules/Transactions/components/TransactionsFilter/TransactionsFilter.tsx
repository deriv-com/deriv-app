import React, { ComponentProps } from 'react';
import { TransactionsPending } from '../TransactionsPending';
import './TransactionsFilter.scss';

type TValue = ComponentProps<typeof TransactionsPending>['filter'];

type TProps = {
    isPendingActive: boolean;
    onSelect: (value: TValue) => void;
};

const TransactionsFilter: React.FC<TProps> = ({ isPendingActive, onSelect }) => {
    return (
        <div className='wallets-transactions-filter'>
            <select onChange={e => onSelect(e.target.value as TValue)}>
                <option value='all'>All</option>
                <option value='deposit'>Deposit</option>
                <option value='withdrawal'>Withdrawal</option>
                {!isPendingActive && <option value='transfer'>Transfer</option>}
            </select>
        </div>
    );
};

export default TransactionsFilter;
