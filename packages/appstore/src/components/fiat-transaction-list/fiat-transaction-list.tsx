import React from 'react';
import { Statement } from '@deriv/api-types';
import { isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import FiatTransactionListItem from './fiat-transaction-list-item';

type TFiatTransactionListProps = {
    wallet: any;
};

const FiatTransactionList = ({ wallet }: TFiatTransactionListProps) => {
    const grouped_transactions = useGroupedFiatTransactions();

    const TransactionsForADay = ({
        day,
        transactions,
    }: {
        day: string;
        transactions: Required<Statement>['transactions'];
    }) => {
        return (
            <div className='fiat-transaction-list__day'>
                <Text
                    size={isMobile() ? 'xxxxs' : 'xxxs'}
                    line_height={isMobile() ? 'm' : 's'}
                    color='less-prominent'
                    weight='lighter'
                >
                    {day}
                </Text>
                {transactions
                    .map(transaction => {
                        if (
                            transaction.amount === undefined ||
                            transaction.balance_after === undefined ||
                            transaction.action_type === undefined
                        )
                            return null;
                        return (
                            <FiatTransactionListItem
                                key={transaction.transaction_id}
                                action_type={
                                    transaction.action_type as React.ComponentProps<
                                        typeof FiatTransactionListItem
                                    >['action_type']
                                }
                                account_name={'TODO get from store'}
                                amount={transaction.amount}
                                balance_after={transaction.balance_after}
                                currency={'TODO'}
                                wallet={wallet}
                            />
                        );
                    })
                    .filter(Boolean)}
            </div>
        );
    };

    return (
        <div className='fiat-transaction-list'>
            {Object.entries(grouped_transactions).map(([day, transactions]) => (
                <TransactionsForADay
                    key={day}
                    day={day}
                    transactions={transactions as Required<Statement>['transactions']}
                />
            ))}
        </div>
    );
};

export default FiatTransactionList;
