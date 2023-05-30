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
        client: { accounts, currency: wallet_currency, loginid },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on },
    } = store;
    const grouped_transactions = useGroupedFiatTransactions();
    const linked_accounts = Object.values(accounts)
        .flatMap(account => account.linked_to)
        .filter(Boolean);

    const wallet_title = React.useMemo(() => {
        return `${is_demo ? localize('Demo') : ''} ${getCurrencyDisplayCode(wallet_currency)} ${localize('Wallet')}`;
    }, [wallet_currency, is_demo]);
    const wallet_icon = React.useMemo(() => {
        return getWalletCurrencyIcon(is_demo ? 'demo' : wallet_currency, is_dark_mode_on, false);
    }, [wallet_currency, is_demo, is_dark_mode_on]);

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
                        let account_title = wallet_title;
                        let account_currency = wallet_currency;
                        let icon = wallet_icon;
                        let icon_type = 'fiat';
                        let platform = null;
                        if (transaction.action_type === 'transfer') {
                            const other_loginid =
                                transaction.to?.loginid === loginid
                                    ? transaction.from?.loginid
                                    : transaction.to?.loginid;
                            if (!other_loginid) return null;
                            const other_account = accounts[other_loginid];
                            if (other_account) {
                                if (!other_account.currency) return null;
                                account_currency = other_account.currency;
                                account_title = accountName(
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
                            } else {
                                const app_account = linked_accounts.find(account => account?.loginid === other_loginid);
                                if (!app_account) return null;
                                platform = app_account.platform;
                                account_title = `${localize('Deriv Apps')} ${platform.toUpperCase()} ${localize(
                                    'account'
                                )}`;
                            }
                        }
                        return (
                            <FiatTransactionListItem
                                key={transaction.transaction_id}
                                action_type={
                                    // TODO fix this mismatch somehow
                                    transaction.action_type as React.ComponentProps<
                                        typeof FiatTransactionListItem
                                    >['action_type']
                                }
                                account_currency={account_currency}
                                account_name={account_title}
                                amount={transaction.amount}
                                balance_after={transaction.balance_after}
                                currency={wallet_currency}
                                icon={icon}
                                icon_type={icon_type}
                                platform={platform}
                            />
                        );
                    })
                    .filter(Boolean)
                    .concat([
                        <FiatTransactionListItem
                            key={-1}
                            action_type='transfer'
                            account_currency={wallet_currency}
                            account_name='Deriv Apps MT5 account'
                            amount={42}
                            balance_after={42}
                            currency={wallet_currency}
                            icon={getWalletCurrencyIcon('USD', is_dark_mode_on, false)}
                            icon_type='fiat'
                            platform='IcDxtradeDerived'
                        />,
                    ])}
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
