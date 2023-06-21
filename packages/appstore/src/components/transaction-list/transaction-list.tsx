import React, { useState } from 'react';
import { Text, Dropdown } from '@deriv/components';
import { useCFDAllAccounts, usePlatformAccounts, useWalletList, useWalletTransactions } from '@deriv/hooks';
import { getCurrencyDisplayCode, isCryptocurrency } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { groupTransactionsByDay } from '@deriv/utils';
import { getWalletCurrencyIcon } from 'Constants/utils';
import NonPendingTransaction from './non-pending-transaction';
import './transaction-list.scss';

const TransactionList = () => {
    const {
        client: { accounts, currency: wallet_currency, loginid, landing_company_shortcode: shortcode },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on, is_mobile },
    } = useStore();
    const { data: wallets } = useWalletList();
    const { demo: demo_platform_accounts, real: real_platform_accounts } = usePlatformAccounts();
    const cfd_accounts = useCFDAllAccounts();

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

    const { transactions } = useWalletTransactions(filter);

    // TODO: change the way grouping is being done
    const grouped_transactions = groupTransactionsByDay(transactions);

    // TODO: refactor once we have useActiveWallet merged
    const current_wallet = wallets.find(wallet => wallet.loginid === loginid) as typeof wallets[number];

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
        transaction_list: ReturnType<typeof useWalletTransactions>['transactions'];
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
                {transaction_list.map(transaction => (
                    <NonPendingTransaction
                        key={transaction.transaction_id}
                        action_type={
                            // TODO fix this mismatch somehow
                            transaction.action_type
                        }
                        account_currency={transaction.account_currency}
                        account_name={transaction?.account_name}
                        amount={
                            (transaction.action_type === 'transfer' &&
                            transaction?.from?.loginid === loginid &&
                            typeof transaction.amount === 'number'
                                ? -transaction?.amount
                                : transaction?.amount) || 0
                        }
                        balance_after={transaction.balance_after || 0}
                        currency={wallet_currency}
                        icon={transaction.icon}
                        icon_type={is_demo ? 'demo' : transaction.icon_type}
                        is_deriv_apps={false}
                    />
                ))}
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
