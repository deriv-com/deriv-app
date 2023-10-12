import React from 'react';
import './WalletTransactionsFilter.scss';

type TProps = {
    isPendingActive: boolean;
    onSelect: (value: string) => void;
};

const WalletTransactionsFilter: React.FC<TProps> = ({ isPendingActive, onSelect }) => {
    return (
        <div className='wallets-transactions-filter'>
            <select onChange={e => onSelect(e.target.value)}>
                <option value='all'>All</option>
                <option value='deposit'>Deposit</option>
                <option value='withdrawal'>Withdrawal</option>
                {!isPendingActive && <option value='transfer'>Transfer</option>}
            </select>
        </div>
    );
};

export default WalletTransactionsFilter;
