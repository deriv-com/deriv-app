import React from 'react';
import { Text } from '@deriv/components';
import { useWalletTransactions } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import NonPendingTransaction from './non-pending-transaction';

export const TransactionsForOneDay = observer(
    ({
        day,
        transaction_list,
    }: {
        day: string;
        transaction_list: ReturnType<typeof useWalletTransactions>['transactions'];
    }) => {
        const {
            client: { loginid },
            ui: { is_mobile },
        } = useStore();

        return (
            <div className='transaction-list__day'>
                <Text
                    className='transaction-list__day-header'
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    line_height={is_mobile ? 'm' : 's'}
                    color='less-prominent'
                    weight='lighter'
                >
                    {day}
                </Text>
                {transaction_list.map(transaction => {
                    let display_transaction = transaction;
                    if (
                        transaction?.action_type === 'transfer' &&
                        transaction?.from?.loginid === loginid &&
                        typeof transaction?.amount === 'number'
                    ) {
                        display_transaction = { ...transaction, amount: -transaction.amount };
                    }
                    return <NonPendingTransaction key={transaction.transaction_id} transaction={display_transaction} />;
                })}
            </div>
        );
    }
);
