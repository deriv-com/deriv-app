import React from 'react';
import { Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { useActiveWallet, useWalletTransactions } from '@deriv/hooks';
import CompletedTransaction from '../completed-transaction';

type TTransactionsForADay = {
    day: string;
    transaction_list: ReturnType<typeof useWalletTransactions>['transactions'];
};

const TransactionsForADay = ({ day, transaction_list }: TTransactionsForADay) => {
    const {
        ui: { is_mobile },
    } = useStore();

    const wallet = useActiveWallet();

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
            {transaction_list.map((transaction: typeof transaction_list[number]) => {
                let display_transaction = transaction;
                if (
                    transaction?.action_type === 'transfer' &&
                    transaction?.from?.loginid === wallet?.loginid &&
                    typeof transaction?.amount === 'number'
                ) {
                    display_transaction = { ...transaction, amount: -transaction.amount };
                }
                return <CompletedTransaction key={transaction.transaction_id} transaction={display_transaction} />;
            })}
        </div>
    );
};

export default TransactionsForADay;
