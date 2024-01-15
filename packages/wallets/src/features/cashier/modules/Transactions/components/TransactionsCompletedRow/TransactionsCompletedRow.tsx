import React, { useMemo } from 'react';
import { WalletText } from '../../../../../../components/Base';
import { THooks } from '../../../../../../types';
import { TransactionsCompletedRowAccountDetails } from './components/TransactionsCompletedRowAccountDetails';
import { TransactionsCompletedRowTransferAccountDetails } from './components/TransactionsCompletedRowTransferAccountDetails';
import './TransactionsCompletedRow.scss';

type TProps = {
    accounts: THooks.AllAccountsList;
    transaction: THooks.InfiniteTransactions | THooks.Transactions;
    wallet: THooks.ActiveWalletAccount;
};

const TransactionsCompletedRow: React.FC<TProps> = ({ accounts, transaction, wallet }) => {
    // TODO: remove this once backend adds `to` and `from` for Deriv X and CTrader transfers
    const dxtradeOrCtraderToFrom = useMemo(() => {
        if (transaction?.action_type !== 'transfer' || !transaction.longcode) return null;
        const longcodeMessageTokens = transaction.longcode.split(' ');
        const direction = longcodeMessageTokens[4] === 'cTrader' ? 'to' : longcodeMessageTokens[1];
        const dxtradeOrCtraderLoginid = longcodeMessageTokens.find(
            token => token.startsWith('DX') || token.startsWith('CT')
        );
        return dxtradeOrCtraderLoginid
            ? {
                  from: { loginid: wallet.loginid },
                  to: { loginid: wallet.loginid },
                  ...(direction && { [direction]: { loginid: dxtradeOrCtraderLoginid } }),
              }
            : null;
    }, [transaction?.action_type, transaction.longcode, wallet.loginid]);

    if (!transaction.action_type || !transaction.amount) return null;

    const displayCurrency = wallet?.currency_config?.display_code || 'USD';
    const displayWalletName = `${displayCurrency} Wallet`;
    const displayActionType =
        wallet.is_virtual && ['deposit', 'withdrawal'].includes(transaction.action_type)
            ? 'Reset balance'
            : transaction.action_type.replace(/^\w/, c => c.toUpperCase());

    return (
        <div className='wallets-transactions-completed-row'>
            {transaction.action_type !== 'transfer' ? (
                <TransactionsCompletedRowAccountDetails
                    accountType={wallet?.account_type ?? ''}
                    actionType={transaction.action_type}
                    currency={wallet?.currency ?? 'USD'}
                    displayAccountName={displayWalletName}
                    displayActionType={displayActionType}
                    isDemo={Boolean(wallet?.is_virtual)}
                />
            ) : (
                <TransactionsCompletedRowTransferAccountDetails
                    accounts={accounts}
                    direction={
                        (transaction.from ?? dxtradeOrCtraderToFrom?.from)?.loginid === wallet?.loginid ? 'to' : 'from'
                    }
                    loginid={
                        [
                            transaction.from?.loginid ?? dxtradeOrCtraderToFrom?.from.loginid,
                            transaction.to?.loginid ?? dxtradeOrCtraderToFrom?.to.loginid,
                        ].find(loginid => loginid !== wallet?.loginid) ?? ''
                    }
                />
            )}
            <div className='wallets-transactions-completed-row__transaction-details'>
                <WalletText color={transaction.amount > 0 ? 'success' : 'error'} size='xs' weight='bold'>
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
