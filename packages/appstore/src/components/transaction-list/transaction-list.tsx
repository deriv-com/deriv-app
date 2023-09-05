import React, { useEffect, useState } from 'react';
import { Div100vhContainer, Dropdown, Loading, ThemedScrollbars } from '@deriv/components';
import { useActiveWallet, useWalletTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import { TransactionsForADay } from './transaction-for-day';
import './transaction-list.scss';

type TTransactionList = {
    contentScrollHandler?: React.UIEventHandler<HTMLDivElement>;
    is_wallet_name_visible?: boolean;
};

const TransactionList = ({ contentScrollHandler, is_wallet_name_visible }: TTransactionList) => {
    const {
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
                      value: 'virtual_credit',
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

    const { transactions, isComplete, isLoading, loadMore, reset } = useWalletTransactions(filter || undefined);

    const grouped_transactions = groupTransactionsByDay(transactions);

    const onValueChange = (e: { target: { name: string; value: string } }) => {
        reset();
        setFilter(e.target.value as typeof filter);
    };

    const getHeightOffset = React.useCallback(() => {
        const header_height = is_mobile ? '16.2rem' : '(24.4rem + 7.8rem)';
        const collapsed_header_height = '12.2rem';
        return !is_mobile || is_wallet_name_visible ? header_height : collapsed_header_height;
    }, [is_mobile, is_wallet_name_visible]);

    const [should_load_more, setShouldLoadMore] = useState(false);

    const onScrollHandler: React.UIEventHandler<HTMLDivElement> = e => {
        if (is_mobile) contentScrollHandler?.(e);
        if (
            !should_load_more &&
            !isLoading &&
            !isComplete &&
            e.currentTarget.scrollHeight - e.currentTarget.scrollTop - e.currentTarget.clientHeight <= 100
        ) {
            setShouldLoadMore(true);
        }
    };

    useEffect(() => {
        if (should_load_more) loadMore();
    }, [should_load_more, loadMore]);

    useEffect(() => {
        setShouldLoadMore(false);
    }, [transactions.length]);

    return (
        <>
            <div className='transaction-list__filter__wrapper transaction-list__container'>
                <Dropdown
                    className='transaction-list__filter'
                    is_align_text_left
                    list={filter_options}
                    onChange={onValueChange}
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
                        {!isLoading ? (
                            <React.Fragment>
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
                                {!isComplete && should_load_more && (
                                    <Loading is_fullscreen={false} className='transaction-list__loader' />
                                )}
                            </React.Fragment>
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
