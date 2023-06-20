import React, { useState } from 'react';
import { Statement } from '@deriv/api-types';
import { Text, Dropdown } from '@deriv/components';
import { useWalletStatement } from '@deriv/hooks';
import { getCurrencyDisplayCode, isCryptocurrency } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import { getWalletCurrencyIcon } from 'Constants/utils';
import FiatTransactionListItem from './fiat-transaction-list-item';
import './transaction-list.scss';

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

    const { data } = useWalletStatement(filter);
    const transactions = data.statement.transactions;

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
                        transaction_list={
                            transaction_list as React.ComponentProps<typeof TransactionsForADay>['transaction_list']
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default TransactionList;
