import React, { useState } from 'react';
import { Text, Dropdown } from '@deriv/components';
import { useActiveWallet, useWalletTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import NonPendingTransaction from './non-pending-transaction';
import './transaction-list.scss';

const TransactionList = () => {
    const {
        client: { loginid },
        ui: { is_mobile },
    } = useStore();

    const wallet = useActiveWallet();

    const filter_options = [
        {
            text: localize('All'),
            value: '',
        },
        ...(wallet?.is_virtual
            ? ([
                  {
                      text: localize('Reset balance'),
                      value: 'reset_balance',
                  },
              ] as const)
            : ([
                  {
                      text: localize('Deposit'),
                      value: 'deposit',
                  },
                  {
                      text: localize('Withdrawal'),
                      value: 'withdrawal',
                  },
              ] as const)),
        {
            text: localize('Transfer'),
            value: 'transfer',
        },
    ] as const;

    const [filter, setFilter] = useState<typeof filter_options[number]['value']>('');

    const { transactions } = useWalletTransactions(filter);

    // @ts-expect-error reset_balance is not supported in the API yet
    const grouped_transactions = groupTransactionsByDay(transactions);

    const TransactionsForADay = ({
        day,
        transaction_list,
    }: {
        day: string;
        transaction_list: ReturnType<typeof useWalletTransactions>['transactions'];
    }) => {
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
    };

    return (
        <div className='transaction-list__container'>
            <div className='transaction-list'>
                <Dropdown
                    className='transaction-list__filter'
                    is_align_text_left
                    list={filter_options}
                    onChange={(e: { target: { value: typeof filter } }) => setFilter(e.target.value)}
                    label={localize('Filter')}
                    suffix_icon='IcFilter'
                    value={filter}
                />
                {Object.entries(grouped_transactions).map(([day, transaction_list]) => (
                    <TransactionsForADay
                        key={day}
                        day={day}
                        transaction_list={
                            transaction_list as React.ComponentProps<typeof TransactionsForADay>['transaction_list']
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
