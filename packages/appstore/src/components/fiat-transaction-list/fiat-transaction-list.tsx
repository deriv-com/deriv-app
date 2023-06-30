import React from 'react';
import { useFetch } from '@deriv/api';
import { Statement } from '@deriv/api-types';
import { getCurrencyDisplayCode, isCryptocurrency } from '@deriv/shared';
import { Text } from '@deriv/components';
import { useGroupedFiatTransactions } from '@deriv/hooks';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';
import './fiat-transaction-list.scss';

const FiatTransactionList = () => {
    const {
        client: { accounts, currency: wallet_currency, is_crypto, loginid, landing_company_shortcode: shortcode },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();
    const { data } = useFetch('statement', { options: { keepPreviousData: true } });
    const transactions = data?.statement?.transactions;

    // TODO remove these mock additions
    accounts.CR90000042 = {
        account_category: 'trading',
        account_type: 'binary',
        balance: 0,
        currency: 'BTC',
        // @ts-expect-error This should be fixed when we remove the mock transactions
        gradient_class: `wallet-card__btc-bg${is_dark_mode_on ? '--dark' : ''}`,
        is_virtual: 0,
        landing_company_name: 'SVG',
        landing_company_shortcode: 'svg',
        linked_to: [],
    };
    accounts.CR90000043 = {
        account_category: 'wallet',
        account_type: 'binary',
        balance: 0,
        currency: 'BTC',
        // @ts-expect-error This should be fixed when we remove the mock transactions
        gradient_class: `wallet-card__btc-bg${is_dark_mode_on ? '--dark' : ''}`,
        is_virtual: 0,
        landing_company_name: 'SVG',
        landing_company_shortcode: 'svg',
        linked_to: [],
    };
    accounts.CR90000044 = {
        account_category: 'wallet',
        account_type: 'binary',
        balance: 0,
        currency: 'BTC',
        // @ts-expect-error This should be fixed when we remove the mock transactions
        gradient_class: `wallet-card__btc-bg${is_dark_mode_on ? '--dark' : ''}`,
        is_virtual: 0,
        landing_company_name: 'SVG',
        landing_company_shortcode: 'svg',
        linked_to: [
            {
                loginid: 'CR90000100',
                platform: 'mt5',
            },
        ],
    };

    // TODO remove the following mock and replace its uses with transactions
    const mock_transactions = is_demo
        ? [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                      type: 'wallet',
                  },
                  to: {
                      loginid: 'CR90000100',
                      type: 'trading',
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
                      type: 'trading',
                  },
                  to: {
                      loginid,
                      type: 'wallet',
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
                      type: 'wallet',
                  },
                  to: {
                      loginid: 'CR90000100',
                      type: 'trading',
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
                      type: 'wallet',
                  },
                  to: {
                      loginid: 'CR90000100',
                      type: 'trading',
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
                      type: 'wallet',
                  },
                  to: {
                      loginid: 'CR90000043',
                      type: 'wallet',
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
                      type: 'trading',
                  },
                  to: {
                      loginid,
                      type: 'wallet',
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
                      type: 'wallet',
                  },
                  to: {
                      loginid,
                      type: 'wallet',
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
                      type: 'wallet',
                  },
                  to: {
                      loginid: 'CR90000043',
                      type: 'wallet',
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
    const grouped_transactions = useGroupedFiatTransactions(mock_transactions);
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
                        let icon_type = is_crypto(wallet_currency) ? 'crypto' : 'fiat';
                        let is_deriv_apps = false;

                        // TODO: use the gradient_card_class value from wallets object when we have it
                        let gradient_class = `wallet-card__${is_demo ? 'demo' : wallet_currency.toLowerCase()}-bg${
                            is_dark_mode_on ? '--dark' : ''
                        }`;

                        if (transaction.action_type === 'transfer') {
                            const other_loginid =
                                transaction.to?.loginid === loginid
                                    ? transaction.from?.loginid
                                    : transaction.to?.loginid;
                            if (!other_loginid) return null;
                            const other_account = accounts[other_loginid];
                            if (other_account) {
                                gradient_class = `wallet-card__${
                                    other_account.is_virtual === 1
                                        ? 'demo'
                                        : other_account?.currency?.toLowerCase() || wallet_currency.toLowerCase()
                                }-bg${is_dark_mode_on ? '--dark' : ''}`;
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
                                gradient_class={gradient_class}
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
        <div className='fiat-transaction-list'>
            {Object.entries(grouped_transactions).map(([day, transaction_list]) => (
                <TransactionsForADay
                    key={day}
                    day={day}
                    transaction_list={transaction_list as Required<Statement>['transactions']}
                />
            ))}
        </div>
    );
};

export default FiatTransactionList;
