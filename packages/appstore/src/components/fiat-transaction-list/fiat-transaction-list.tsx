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
        client: { accounts, currency: wallet_currency, loginid },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();
    const { data } = useFetch('statement', { options: { keepPreviousData: true } });
    const transactions = data?.statement?.transactions;
    // TODO remove the following mock and replace its uses with transactions
    const mock_transactions = is_demo
        ? [
              {
                  action_type: 'initial_fund',
                  amount: 42,
                  app_id: 1,
                  balance_after: 42,
                  contract_id: 6842558021,
                  longcode:
                      'Win payout if AUD/JPY is strictly higher than entry spot at 1 minute after contract start time.',
                  payout: 1,
                  reference_id: {},
                  shortcode: 'CALL_FRXAUDJPY_1_1470637406_1470637466_S0P_0',
                  transaction_id: 13693011401,
                  transaction_time: 1685109944,
              },
              {
                  action_type: 'reset_balance',
                  amount: -42,
                  app_id: 2,
                  balance_after: 0,
                  contract_id: 6842548881,
                  longcode:
                      'Win payout if AUD/JPY is strictly lower than entry spot at 1 minute after contract start time.',
                  payout: 1,
                  purchase_time: 1470637295,
                  reference_id: 13692993001,
                  shortcode: 'PUT_FRXAUDJPY_1_1470637295_1470637355_S0P_0',
                  transaction_id: 13693003421,
                  transaction_time: 1685109944,
              },
              {
                  action_type: 'reset_balance',
                  amount: -42,
                  app_id: 2,
                  balance_after: 0,
                  contract_id: 6842548881,
                  longcode:
                      'Win payout if AUD/JPY is strictly lower than entry spot at 1 minute after contract start time.',
                  payout: 1,
                  purchase_time: 1470637295,
                  reference_id: 13692993001,
                  shortcode: 'PUT_FRXAUDJPY_1_1470637295_1470637355_S0P_0',
                  transaction_id: 13693003421,
                  transaction_time: 1685109944,
              },
          ]
        : [
              {
                  action_type: 'deposit',
                  amount: 2,
                  app_id: {},
                  balance_after: 44.24,
                  contract_id: {},
                  longcode: 'Payment from Binary Services Ltd Apr 2017',
                  payout: {},
                  reference_id: {},
                  shortcode: {},
                  transaction_id: 17494117541,
                  transaction_time: 1685009944,
              },
              {
                  action_type: 'transfer',
                  amount: 5.55,
                  from: {
                      loginid: 'CR90000000',
                      type: 'trading',
                  },
                  to: {
                      loginid: 'CR90000003',
                      type: 'wallet',
                  },
                  app_id: {},
                  balance_after: 5.55,
                  contract_id: {},
                  longcode: 'Transfer from <> to <>. Includes fees',
                  payout: {},
                  reference_id: {},
                  shortcode: {},
                  transaction_id: 17494415489,
                  transaction_time: 1685009944,
              },
              {
                  action_type: 'withdrawal',
                  amount: -5.55,
                  app_id: {},
                  balance_after: 0,
                  contract_id: {},
                  longcode: 'Account closed. Please contact customer support for assistance.',
                  payout: {},
                  reference_id: {},
                  shortcode: {},
                  transaction_id: 17494415481,
                  transaction_time: 1684009944,
              },
              {
                  action_type: 'transfer',
                  amount: 5.55,
                  from: {
                      loginid: 'CR90000000',
                      type: 'trading',
                  },
                  to: {
                      loginid: 'CRW1000',
                      type: 'wallet',
                  },
                  app_id: {},
                  balance_after: 5.55,
                  contract_id: {},
                  longcode: 'Transfer from <> to <>. Includes fees',
                  payout: {},
                  reference_id: {},
                  shortcode: {},
                  transaction_id: 17494415482,
                  transaction_time: 1684009944,
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
                    // TODO remove the hardcoded concat below later
                    .concat([
                        <FiatTransactionListItem
                            key={-1}
                            action_type='transfer'
                            account_currency={wallet_currency}
                            account_name='Deriv Apps DXtrade account'
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
