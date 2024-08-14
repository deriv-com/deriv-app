import React from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text } from '@deriv-com/ui';
import { THooks } from '../../../../../../types';
import { getTransactionLabels } from '../../constants';
import { TransactionsCompletedRowAccountDetails, TransactionsCompletedRowTransferAccountDetails } from './components';
import './TransactionsCompletedRow.scss';

type TProps = {
    accounts: THooks.AllAccountsList;
    transaction: THooks.InfiniteTransactions | THooks.Transactions;
    wallet: THooks.ActiveWalletAccount;
};

const TransactionsCompletedRow: React.FC<TProps> = ({ accounts, transaction, wallet }) => {
    const { localize } = useTranslations();

    if (!transaction.action_type || !transaction.amount) return null;

    const displayCurrency = wallet?.currency_config?.display_code || 'USD';
    const displayWalletName = `${displayCurrency} Wallet`;
    const displayNonTransferActionType =
        wallet.is_virtual && ['deposit', 'withdrawal'].includes(transaction.action_type)
            ? getTransactionLabels().reset_balance
            : //@ts-expect-error we only need partial action types
              getTransactionLabels()[transaction.action_type];
    const displayTransferActionType =
        transaction.from?.loginid === wallet?.loginid ? localize('Transfer to') : localize('Transfer from');

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <div className='wallets-transactions-completed-row'>
                {transaction.action_type !== 'transfer' ? (
                    <TransactionsCompletedRowAccountDetails
                        accountType={wallet?.account_type ?? ''}
                        actionType={transaction.action_type}
                        currency={wallet?.currency ?? 'USD'}
                        displayAccountName={displayWalletName}
                        displayActionType={displayNonTransferActionType}
                        isDemo={Boolean(wallet?.is_virtual)}
                        transactionID={transaction.transaction_id}
                    />
                ) : (
                    <TransactionsCompletedRowTransferAccountDetails
                        accounts={accounts}
                        displayActionType={displayTransferActionType}
                        loginid={
                            [transaction.from?.loginid, transaction.to?.loginid].find(
                                loginid => loginid !== wallet?.loginid
                            ) ?? ''
                        }
                        transactionID={transaction.transaction_id}
                    />
                )}
                <div className='wallets-transactions-completed-row__transaction-details'>
                    <Text color={transaction.amount > 0 ? 'success' : 'error'} size='xs' weight='bold'>
                        {transaction.amount && transaction.amount > 0 ? '+' : ''}
                        {transaction.display_amount}
                    </Text>
                    <Text color='primary' size='2xs'>
                        <Localize
                            i18n_default_text='Balance: {{balance}}'
                            values={{
                                balance: transaction.display_balance_after,
                            }}
                        />
                    </Text>
                </div>
            </div>
        </React.Fragment>
    );
};

export default TransactionsCompletedRow;
