import React, { useState } from 'react';
import classNames from 'classnames';
import { useDebounceCallback } from 'usehooks-ts';
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

type TTransactionsCompletedRowContentProps = TProps & {
    displayNonTransferActionType: string;
    displayTransferActionType: string;
    displayWalletName: string;
    shouldShowTraceId: boolean;
};

const TransactionsCompletedRowContent: React.FC<TTransactionsCompletedRowContentProps> = ({
    accounts,
    displayNonTransferActionType,
    displayTransferActionType,
    displayWalletName,
    shouldShowTraceId,
    transaction,
    wallet,
}) => {
    const { action_type: actionType, longcode, transaction_id: transactionId } = transaction;
    const { account_type: accountType = '', currency = 'USD', is_virtual: isVirtual } = wallet;

    if (shouldShowTraceId && transaction.longcode) {
        return (
            <Text as='p' size='xs'>
                {longcode}
            </Text>
        );
    }
    return (
        <>
            {actionType && actionType !== 'transfer' ? (
                <TransactionsCompletedRowAccountDetails
                    accountType={accountType}
                    actionType={actionType}
                    currency={currency}
                    displayAccountName={displayWalletName}
                    displayActionType={displayNonTransferActionType}
                    isDemo={Boolean(isVirtual)}
                    transactionID={transactionId}
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
                <Text
                    color={transaction.amount && transaction.amount > 0 ? 'success' : 'error'}
                    size='xs'
                    weight='bold'
                >
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
        </>
    );
};

const TransactionsCompletedRow: React.FC<TProps> = ({ accounts, transaction, wallet }) => {
    const { localize } = useTranslations();
    const [shouldShowTraceId, setShouldShowTraceId] = useState(false);
    const debouncedSetShouldShowTraceId = useDebounceCallback(() => setShouldShowTraceId(false), 5000);

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

    const handleRowClick = () => {
        setShouldShowTraceId(!shouldShowTraceId);
        debouncedSetShouldShowTraceId();
    };

    return (
        <React.Fragment>
            <Divider color='var(--border-divider)' />
            <button
                className={classNames('wallets-transactions-completed-row', {
                    'wallets-transactions-completed-row--active': shouldShowTraceId,
                })}
                onClick={handleRowClick}
            >
                <TransactionsCompletedRowContent
                    accounts={accounts}
                    displayNonTransferActionType={displayNonTransferActionType}
                    displayTransferActionType={displayTransferActionType}
                    displayWalletName={displayWalletName}
                    shouldShowTraceId={shouldShowTraceId}
                    transaction={transaction}
                    wallet={wallet}
                />
            </button>
        </React.Fragment>
    );
};

export default TransactionsCompletedRow;
