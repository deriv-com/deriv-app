import React, { useState } from 'react';
import { useFetch } from '@deriv/api';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isCryptocurrency } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';
import './transaction-list.scss';
import TransactionListFilter from './transaction-list-filter';

const TransactionList = () => {
    const {
        client: { accounts, currency: wallet_currency, loginid, landing_company_shortcode: shortcode },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();

    const filter_options = [
        {
            text: 'All',
            value: '',
        },
        ...(is_demo
            ? ([
                  {
                      text: 'Reset balance',
                      value: 'reset_balance',
                  },
              ] as const)
            : ([
                  {
                      text: 'Deposit',
                      value: 'deposit',
                  },
                  {
                      text: 'Withdrawal',
                      value: 'withdrawal',
                  },
              ] as const)),
        {
            text: 'Transfer',
            value: 'transfer',
        },
    ] as const;

    const [filter, setFilter] = useState<typeof filter_options[number]['value']>('');

    const { data } = useFetch('statement', {
        options: { keepPreviousData: true },
        ...(!!filter && {
            payload: {
                // TODO: remove "as" when "reset_balance" is a valid action_type
                action_type: filter as Exclude<typeof filter, 'reset_balance'>,
            },
        }),
    });
    const transactions = data?.statement?.transactions;

    // TODO: change grouping logic
    const grouped_transactions = useGroupedFiatTransactions(transactions);
    const linked_accounts = Object.values(accounts)
        .flatMap(account => account.linked_to)
        .filter(Boolean);

    const wallet_title = React.useMemo(() => {
        return `${is_demo ? localize('Demo') : ''} ${getCurrencyDisplayCode(wallet_currency)} ${localize('Wallet')}`;
    }, [wallet_currency, is_demo]);
    const wallet_icon = React.useMemo(() => {
        return getWalletCurrencyIcon(is_demo ? 'demo' : wallet_currency, is_dark_mode_on, false);
    }, [wallet_currency, is_demo, is_dark_mode_on]);

    const accountName = (is_virtual: boolean, currency: string, is_wallet: boolean) =>
        `${is_virtual ? localize('Demo') : ''} ${getCurrencyDisplayCode(currency)} ${localize(
            is_wallet ? 'Wallet' : 'account'
        )}`;

    const landingCompanyName = (landing_company_shortcode: string) => {
        switch (landing_company_shortcode) {
            case 'svg':
                return landing_company_shortcode.toUpperCase();
            case 'malta':
            case 'maltainvest':
                return 'Malta';
            default:
                return '';
        }
    };

    const TransactionsForADay = ({
        day,
        transaction_list,
    }: {
        day: string;
        transaction_list: Required<Statement>['transactions'];
    }) => {
        return (
            <div className='fiat-transaction-list__day'>
                <Text
                    className='fiat-transaction-list__day_header'
                    size={is_mobile ? 'xxxxs' : 'xxxs'}
                    line_height={is_mobile ? 'm' : 's'}
                    color='less-prominent'
                    weight='lighter'
                >
                    {day}
                </Text>
                {transaction_list
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
                        let is_deriv_apps = false;
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
                                const landing_company_name = landingCompanyName(shortcode);
                                const account_category = is_demo ? localize('Demo') : `(${landing_company_name})`;
                                account_title = `${localize('Deriv Apps')} ${account_category} ${localize('account')}`;
                                is_deriv_apps = true;
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
                                amount={
                                    transaction.action_type === 'transfer' && transaction?.from?.loginid === loginid
                                        ? -transaction.amount
                                        : transaction.amount
                                }
                                balance_after={transaction.balance_after}
                                currency={wallet_currency}
                                icon={icon}
                                icon_type={is_demo ? 'demo' : icon_type}
                                is_deriv_apps={is_deriv_apps}
                            />
                        );
                    })
                    .filter(Boolean)}
            </div>
        );
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <TransactionListFilter
                onChange={e => {
                    setFilter(e.target.value);
                }}
                options={filter_options}
                value={filter}
            />
            <div className='fiat-transaction-list'>
                {Object.entries(grouped_transactions).map(([day, transaction_list]) => (
                    <TransactionsForADay
                        key={day}
                        day={day}
                        transaction_list={transaction_list as Required<Statement>['transactions']}
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
