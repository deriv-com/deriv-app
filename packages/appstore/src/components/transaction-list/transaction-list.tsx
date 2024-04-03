import React, { useState } from 'react';
import { Dropdown } from '@deriv/components';
import { useActiveWallet, useWalletTransactions } from '@deriv/hooks';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import { TransactionsForOneDay } from './transaction-for-day';
import './transaction-list.scss';

const TransactionList = () => {
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

    const onValueChange = (e: { target: { name: string; value: string } }) => {
        setFilter(e.target.value as typeof filter);
    };

    return (
        <div className='transaction-list__container'>
            <div className='transaction-list'>
                <Dropdown
                    className='transaction-list__filter'
                    is_align_text_left
                    list={filter_options}
                    onChange={onValueChange}
                    label={localize('Filter')}
                    suffix_icon='IcFilter'
                    value={filter}
                />
                {Object.entries(grouped_transactions).map(([day, transaction_list]) => (
                    <TransactionsForOneDay
                        key={day}
                        day={day}
                        transaction_list={
                            transaction_list as React.ComponentProps<typeof TransactionsForOneDay>['transaction_list']
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
