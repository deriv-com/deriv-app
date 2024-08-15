import React from 'react';
import { useTranslations } from '@deriv-com/translations';
import { WalletsActionScreen } from '../../../../../../components';
//TODO: replace with quill-icons
import NoRecentTransactions from '../../../../../../public/images/no-recent-transactions.svg';
import './TransactionsNoDataState.scss';

const TransactionsNoDataState = () => {
    const { localize } = useTranslations();

    return (
        <div className='wallets-transactions-no-data-state'>
            <WalletsActionScreen icon={<NoRecentTransactions />} title={localize('No transactions found')} />
        </div>
    );
};

export default TransactionsNoDataState;
