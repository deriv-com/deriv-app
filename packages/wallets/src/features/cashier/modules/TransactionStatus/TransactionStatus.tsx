import React, { useCallback } from 'react';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton, WalletText } from '../../../../components/Base';
import { Loader } from '../../../../components/Loader';
import Warning from '../../../../public/images/warning.svg';
import { CryptoTransaction } from './components/CryptoTransaction';
import useRecentTransactions from './hooks/useRecentTransactions';
import './TransactionStatus.scss';

type TTransactionStatus = {
    transactionType?: 'deposit' | 'withdrawal';
};

const TransactionStatus = ({ transactionType }: TTransactionStatus) => {
    const { isError, isLoading, recentTransactions } = useRecentTransactions();
    const { data: wallet } = useActiveWalletAccount();

    const ErrorState = useCallback(
        () => (
            <React.Fragment>
                <WalletText lineHeight='sm' size='xs'>
                    Unfortunately, we cannot retrieve the information at this time.
                </WalletText>
                <div className='transaction-status-divider' />
                <WalletButton
                    color='transparent'
                    isFullWidth={true}
                    onClick={() => {
                        /* should re-subscribe */
                    }}
                    size='sm'
                    text='Refresh'
                    variant='outlined'
                />
            </React.Fragment>
        ),
        []
    );

    const SuccessState = useCallback(() => {
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
                                    currencyDisplayCode={wallet?.currency_config?.code || ''}
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                                <div
                                    className={
                                        index < filteredTransactions.length - 1 && index < 2
                                            ? 'transaction-status-divider--light'
                                            : 'transaction-status-divider'
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
                        <div className='transaction-status-divider' />
                    </React.Fragment>
                )}
            </React.Fragment>
        );
    }, [recentTransactions, transactionType, wallet?.currency_config?.code]);

    return (
        <div className='transaction-status-container'>
            <div className='transaction-status-header'>
                <WalletText size='md' weight='bold'>
                    Transaction status
                </WalletText>
                {isError && <Warning />}
            </div>
            <div className='transaction-status-divider' />
            <div className='transaction-status-body'>
                {isLoading && <Loader color='#85acb0' />}
                {isError && <ErrorState />}
                {!isLoading && !isError && <SuccessState />}
            </div>
        </div>
    );
};

export default TransactionStatus;
