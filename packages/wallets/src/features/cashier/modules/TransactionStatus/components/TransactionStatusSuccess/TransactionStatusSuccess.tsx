import React from 'react';
import { WalletButton, WalletText } from '../../../../../../components/Base';
import { THooks } from '../../../../../../types';
import useRecentTransactions from '../../hooks/useRecentTransactions';
import { CryptoTransaction } from '../CryptoTransaction';

type TTransactionStatusSuccess = {
    recentTransactions: ReturnType<typeof useRecentTransactions>['recentTransactions'];
    transactionType?: THooks.CryptoTransactions['transaction_type'];
    wallet: THooks.ActiveWalletAccount;
};

const TransactionStatusSuccess = ({ recentTransactions, transactionType, wallet }: TTransactionStatusSuccess) => {
    const filteredTransactions =
        recentTransactions?.filter(
            el => !transactionType || (transactionType === 'deposit' ? el.is_deposit : el.is_withdrawal)
        ) || [];

    return (
        <React.Fragment>
            {filteredTransactions?.length > 0 ? (
                <React.Fragment>
                    {filteredTransactions?.slice(0, 3).map((transaction, index) => (
                        <React.Fragment key={transaction.id}>
                            <CryptoTransaction
                                currencyDisplayCode={wallet.currency_config?.code || ''}
                                key={transaction.id}
                                transaction={transaction}
                            />
                            <div
                                className={
                                    index < filteredTransactions.length - 1 && index < 2
                                        ? 'transaction-status-success-divider--light'
                                        : 'transaction-status-success-divider'
                                }
                            />
                        </React.Fragment>
                    ))}
                    {filteredTransactions.length > 3 && (
                        <WalletButton
                            color='transparent'
                            isFullWidth={true}
                            onClick={() => {
                                /* should open the list of recent transactions */
                            }}
                            size='sm'
                            text='View more'
                            variant='outlined'
                        />
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <WalletText size='xs'>No recent transactions.</WalletText>
                    <div className='transaction-status-success-divider' />
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default TransactionStatusSuccess;
