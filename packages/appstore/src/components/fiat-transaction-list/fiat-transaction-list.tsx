import React from 'react';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';

const FiatTransactionList = () => {
    const store = useStore();
    const {
        client: { currency },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on },
    } = store;
    const grouped_transactions = useGroupedFiatTransactions();

    const wallet_title = React.useMemo(() => {
        return `${is_demo ? localize('Demo') : ''} ${getCurrencyDisplayCode(currency)} ${localize('Wallet')}`;
    }, [currency, is_demo]);

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
                        const account_name = wallet_title;
                        const icon = getWalletCurrencyIcon(is_demo ? 'demo' : currency, is_dark_mode_on, false);
                        const icon_type = 'fiat';
                        if (transaction.action_type === 'transfer') {
                            // TODO use to/from loginid to get and reassign transaction_account_name, icon & icon_type
                        }
                        return (
                            <FiatTransactionListItem
                                key={transaction.transaction_id}
                                action_type={
                                    transaction.action_type as React.ComponentProps<
                                        typeof FiatTransactionListItem
                                    >['action_type']
                                }
                                account_name={account_name}
                                amount={transaction.amount}
                                balance_after={transaction.balance_after}
                                currency={currency}
                                icon={icon}
                                icon_type={icon_type}
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
