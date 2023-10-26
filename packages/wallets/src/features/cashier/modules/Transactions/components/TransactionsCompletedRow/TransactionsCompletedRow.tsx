import React, { useMemo } from 'react';
import { useActiveWalletAccount, useTransactions } from '@deriv/api';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import './TransactionsCompletedRow.scss';

type TProps = {
    transaction: NonNullable<ReturnType<typeof useTransactions>['data']>[number];
};

const TransactionsCompletedRow: React.FC<TProps> = ({ transaction }) => {
    const { data } = useActiveWalletAccount();
    const displayCode = useMemo(() => data?.currency_config?.display_code || 'USD', [data]);

    return (
        <div className='wallets-transactions-completed-row'>
            <div className='wallets-transactions-completed-row__account-details'>
                <WalletCurrencyCard currency={data?.currency || 'USD'} isDemo={data?.is_virtual} size='md' />
                <div>
                    <p className='wallets-transactions-completed-row__account-details__action-type'>
                        {transaction.action_type}
                    </p>
                    <p className='wallets-transactions-completed-row__account-details__wallet-name'>
                        {displayCode} Wallet
                    </p>
                </div>
            </div>
            <div className='wallets-transactions-completed-row__transaction-details'>
                <p
                    className={`wallets-transactions-completed-row__transaction-details__amount ${
                        transaction?.amount && transaction.amount < 0
                            ? 'wallets-transactions-completed-row__transaction-details__amount--negative'
                            : ''
                    }`}
                >
                    {transaction?.amount && transaction?.amount > 0 ? '+' : ''}
                    {transaction.display_amount}
                </p>
                <p className='wallets-transactions-completed-row__transaction-details__balance'>
                    Balance: {transaction.display_balance_after}
                </p>
            </div>
        </div>
    );
};

export default TransactionsCompletedRow;
