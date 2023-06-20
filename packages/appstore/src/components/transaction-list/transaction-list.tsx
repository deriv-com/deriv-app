import React, { useState } from 'react';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isCryptocurrency } from '@deriv/shared';
import { Text, Dropdown } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';
import './transaction-list.scss';

const useFetch = (name: string, props: any) => {
    const {
        client: { loginid },
        traders_hub: { is_demo },
    } = useStore();

    const mock_transactions = is_demo
        ? [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'derivapps',
                  },
                  app_id: {},
                  balance_after: 9995,
                  transaction_id: 17494415484,
                  transaction_time: 1685942139,
              },
              {
                  action_type: 'reset_balance',
                  amount: 350,
                  balance_after: 10000,
                  transaction_id: 13693003421,
                  transaction_time: 1685942138,
              },
              {
                  action_type: 'transfer',
                  amount: 200,
                  from: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                      account_type: 'derivapps',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                  },
                  balance_after: 9650,
                  transaction_id: 17494415483,
                  transaction_time: 1685855740,
              },
              {
                  action_type: 'transfer',
                  amount: 550,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                  },
                  app_id: {},
                  balance_after: 9450,
                  transaction_id: 17494415482,
                  transaction_time: 1685855739,
              },
              {
                  action_type: 'initial_fund',
                  amount: 10000,
                  balance_after: 10000,
                  transaction_id: 13693011401,
                  transaction_time: 1685855738,
              },
          ]
        : [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                  },
                  balance_after: 0,
                  transaction_id: 17494117541,
                  transaction_time: 1685942138,
              },
              {
                  action_type: 'transfer',
                  amount: 20,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                  },
                  balance_after: 5,
                  transaction_id: 17494415489,
                  transaction_time: 1685942137,
              },
              {
                  action_type: 'deposit',
                  amount: 25,
                  balance_after: 25,
                  transaction_id: 17494415481,
                  transaction_time: 1685942136,
              },
              {
                  action_type: 'withdrawal',
                  amount: 750,
                  balance_after: 0,
                  transaction_id: 17494415480,
                  transaction_time: 1685942135,
              },
              {
                  action_type: 'transfer',
                  amount: 100,
                  from: {
                      loginid: 'CR90000100',
                      account_category: 'trading',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  balance_after: 750,
                  transaction_id: 17494415479,
                  transaction_time: 1685855738,
              },
              {
                  action_type: 'transfer',
                  amount: 200,
                  from: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                      account_type: 'crypto',
                  },
                  to: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  balance_after: 650,
                  transaction_id: 17494117541,
                  transaction_time: 1685855737,
              },
              {
                  action_type: 'transfer',
                  amount: 550,
                  from: {
                      loginid,
                      account_category: 'wallet',
                      account_type: '',
                  },
                  to: {
                      loginid: 'CR90000043',
                      account_category: 'wallet',
                      account_type: 'crypto',
                  },
                  balance_after: 450,
                  transaction_id: 17494117540,
                  transaction_time: 1685855736,
              },
              {
                  action_type: 'deposit',
                  amount: 1000,
                  balance_after: 1000,
                  transaction_id: 17494117539,
                  transaction_time: 1685769338,
              },
          ];

    return {
        data: {
            statement: {
                transactions: (mock_transactions as { action_type: string }[]).filter(
                    el => !props?.payload?.action_type || el.action_type === props?.payload?.action_type
                ),
            },
        },
        isLoading: false,
        isSuccess: true,
    };
};

const TransactionList = () => {
    const {
        client: { accounts, currency: wallet_currency, loginid, landing_company_shortcode: shortcode },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();

    const filter_options = [
        {
            text: localize('All'),
            value: '',
        },
        ...(is_demo
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
    const grouped_transactions = groupTransactionsByDay(transactions);

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
        transaction_list: Required<Statement>['transactions'] &
            {
                to?: { account_category: 'wallet' | 'trading'; account_type: string };
                from?: { account_category: 'wallet' | 'trading'; account_type: string };
            }[];
    }) => {
        return (
            <div className='transaction-list__day'>
                <Text
                    className='transaction-list__day_header'
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
                            const other_party = transaction.to?.loginid === loginid ? transaction.from : transaction.to;
                            const other_loginid = other_party?.loginid;
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
                        transaction_list={transaction_list as Required<Statement>['transactions']}
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
