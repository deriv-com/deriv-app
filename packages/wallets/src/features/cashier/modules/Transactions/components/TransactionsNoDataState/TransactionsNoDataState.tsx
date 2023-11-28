import React from 'react';
import { useHistory } from 'react-router-dom';
import NoRecentTransactions from '../../../../../../public/images/no-recent-transactions.svg';
import './TransactionsNoDataState.scss';

const TransactionsNoDataState = () => {
    const history = useHistory();

    return (
        <div className='wallets-transactions-no-data-state'>
            <NoRecentTransactions />
            <p className='wallets-transactions-no-data-state__title'>No recent transactions</p>
            <p className='wallets-transactions-no-data-state__description'>
                Make a deposit or transfer funds from your existing trading account(s) or other Wallet(s).
            </p>
            <div className='wallets-transactions-no-data-state__buttons'>
                <button
                    className='wallets-transactions-no-data-state__buttons__transfer'
                    onClick={() => history.push('/wallets/cashier/transfer')}
                >
                    Transfer funds
                </button>
                <button
                    className='wallets-transactions-no-data-state__buttons__deposit'
                    onClick={() => history.push('/wallets/cashier/deposit')}
                >
                    Deposit funds
                </button>
            </div>
        </div>
    );
};

export default TransactionsNoDataState;
