import React from 'react';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isCryptocurrency, isMobile } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';

const FiatTransactionList = () => {
    const store = useStore();
    const {
        client: { accounts, currency: fiat_currency, loginid },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on },
    } = store;
    const grouped_transactions = useGroupedFiatTransactions();

    const accountName = React.useCallback(
        (is_virtual: boolean, currency: string, is_wallet: boolean) =>
            `${is_virtual ? localize('Demo') : ''} ${getCurrencyDisplayCode(currency)} ${localize(
                is_wallet ? 'Wallet' : 'account'
            )}`,
        []
    );

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
                        let account_name = accountName(is_demo, fiat_currency, true);
                        let account_currency = fiat_currency;
                        let icon = getWalletCurrencyIcon(is_demo ? 'demo' : fiat_currency, is_dark_mode_on, false);
                        let icon_type = 'fiat';
                        if (transaction.action_type === 'transfer') {
                            const other_loginid =
                                transaction.to?.loginid === loginid
                                    ? transaction.from?.loginid
                                    : transaction.to?.loginid;
                            if (!other_loginid) return null;
                            const other_account = accounts[other_loginid];
                            if (!other_account) return null;
                            if (!other_account.currency) return null;
                            account_currency = other_account.currency;
                            account_name = accountName(
                                !!other_account.is_virtual,
                                other_account.currency,
                                other_account.account_category === 'wallet'
                            );
                            icon = getWalletCurrencyIcon(
                                other_account.is_virtual ? 'demo' : other_account.currency || '',
                                is_dark_mode_on,
                                false
                            );
                            icon_type = isCryptocurrency(account_currency) ? 'crypto' : 'fiat';
                        }
                        return (
                            <FiatTransactionListItem
                                key={transaction.transaction_id}
                                action_type={
                                    transaction.action_type as React.ComponentProps<
                                        typeof FiatTransactionListItem
                                    >['action_type']
                                }
                                account_currency={account_currency}
                                account_name={account_name}
                                amount={transaction.amount}
                                balance_after={transaction.balance_after}
                                currency={fiat_currency}
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
