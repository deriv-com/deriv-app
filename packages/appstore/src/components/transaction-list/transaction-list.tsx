import React, { useEffect, useState } from 'react';
import { Div100vhContainer, Dropdown, Loading, Text, ThemedScrollbars } from '@deriv/components';
import { useActiveWallet, useWalletTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import NonPendingTransaction from './non-pending-transaction';
import './transaction-list.scss';

type TTransactionList = {
    contentScrollHandler?: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible?: boolean;
};

const TransactionList = ({ contentScrollHandler, is_wallet_name_visible }: TTransactionList) => {
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
    const [page_count, setPageCount] = useState(1);

    useEffect(() => {
        setPageCount(1);
    }, [filter]);

    const { transactions, isLoading, isComplete } = useWalletTransactions(filter, page_count);

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
                {transaction_list.map((transaction: typeof transaction_list[number]) => {
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

    const getHeightOffset = React.useCallback(() => {
        const header_height = is_mobile ? '16.2rem' : '24.4rem';
        const collapsed_header_height = '12.2rem';
        return is_wallet_name_visible ? header_height : collapsed_header_height;
    }, [is_mobile, is_wallet_name_visible]);

    const onScrollHandler: React.UIEventHandler<HTMLDivElement> = e => {
        if (is_mobile) contentScrollHandler?.(e);
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight <= 100) {
            if (!isComplete) setPageCount(page_count + 1);
        }
    };

    return (
        <>
            <div className='transaction-list__filter__wrapper transaction-list__container'>
                <Dropdown
                    className='transaction-list__filter'
                    is_align_text_left
                    list={filter_options}
                    onChange={(e: { target: { value: typeof filter } }) => setFilter(e.target.value)}
                    label={localize('Filter')}
                    suffix_icon='IcFilter'
                    value={filter}
                />
            </div>
            <ThemedScrollbars
                className='transaction-list__scroll'
                is_scrollbar_hidden={is_mobile}
                onScroll={onScrollHandler}
            >
                <Div100vhContainer className='transaction-list__container' height_offset={getHeightOffset()}>
                    <div className='transaction-list'>
                        {!isLoading || page_count >= 1 ? (
                            <>
                                {Object.entries(grouped_transactions).map(([day, transaction_list]) => (
                                    <TransactionsForADay
                                        key={
                                            // eslint-disable-next-line react/prop-types
                                            day + transaction_list.length.toString()
                                        }
                                        day={day}
                                        transaction_list={
                                            transaction_list as React.ComponentProps<
                                                typeof TransactionsForADay
                                            >['transaction_list']
                                        }
                                    />
                                ))}
                                {!isComplete && <Loading is_fullscreen={false} className='transaction-list__loader' />}
                            </>
                        ) : (
                            <Loading is_fullscreen={false} />
                        )}
                    </div>
                </Div100vhContainer>
            </ThemedScrollbars>
        </>
    );
};

export default TransactionList;
