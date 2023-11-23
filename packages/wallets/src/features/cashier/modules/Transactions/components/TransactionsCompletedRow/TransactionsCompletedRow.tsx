import React from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletListCardBadge } from '../../../../../../components';
import { WalletText } from '../../../../../../components/Base';
import { WalletCurrencyCard } from '../../../../../../components/WalletCurrencyCard';
import { THooks } from '../../../../../../types';
import './TransactionsCompletedRow.scss';

type TProps = {
    transaction: THooks.Transactions;
};

const TransactionsCompletedRow: React.FC<TProps> = ({ transaction }) => {
    const { data: wallet } = useActiveWalletAccount();
    const displayCode = wallet?.currency_config?.display_code || 'USD';

    if (!transaction.action_type || !transaction.amount) return null;

    return (
        <div className='wallets-transactions-completed-row'>
            <div className='wallets-transactions-completed-row__account-details'>
                <WalletCurrencyCard currency={wallet?.currency || 'USD'} isDemo={wallet?.is_virtual} size='md' />
                <div className='wallets-transactions-completed-row__type-and-wallet-name'>
                    <WalletText color='primary' size='xs'>
                        {transaction.action_type.replace(/^\w/, c => c.toUpperCase())}
                    </WalletText>
                    <div className='wallets-transactions-completed-row__wallet-name'>
                        <WalletText color='general' size='xs' weight='bold'>
                            {displayCode} Wallet
                        </WalletText>
                        {!wallet?.is_virtual && <WalletListCardBadge label={wallet?.landing_company_name} />}
                    </div>
                </div>
            </div>
            <div className='wallets-transactions-completed-row__transaction-details'>
                <WalletText color={transaction.amount > 0 ? 'success' : 'red'} size='xs' weight='bold'>
                    {transaction.amount && transaction.amount > 0 ? '+' : ''}
                    {transaction.display_amount}
                </WalletText>
                <WalletText color='primary' size='2xs'>
                    Balance: {transaction.display_balance_after}
                </WalletText>
            </div>
        </div>
    );
};

export default TransactionsCompletedRow;
