import React from 'react';
//TODO: replace with quill-icons
import NoRecentTransactions from '../../../../../../public/images/no-recent-transactions.svg';
import { WalletsActionScreen } from '../../../../../../components';
import './TransactionsNoDataState.scss';

const TransactionsNoDataState = () => {
    return (
        <div className='wallets-transactions-no-data-state'>
            <WalletsActionScreen icon={<NoRecentTransactions />} title={'No transactions found'} />
        </div>
    );
};

export default TransactionsNoDataState;
