import { useFetch } from '@deriv/api';
import { Statement } from '@deriv/api-types';
import { useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import { useCFDAllAccounts, useCurrencyConfig, usePlatformAccounts, useWalletList } from './index';

type TWalletTransaction =
    | Omit<Required<Statement>['transactions'][number], 'action_type'> & {
          action_type: 'deposit' | 'withdrawal' | 'initial_fund' | 'reset_balance' | 'transfer';
      };

const useWalletTransactions = (
    action_type: '' | 'deposit' | 'withdrawal' | 'initial_fund' | 'reset_balance' | 'transfer'
) => {
    const {
        client: { loginid, landing_company_shortcode: shortcode },
        traders_hub: { is_demo },
        ui: { is_dark_mode_on },
    } = useStore();
    const { data: wallets } = useWalletList();
    let { demo: demo_platform_account } = usePlatformAccounts();
    const { real: real_platform_accounts } = usePlatformAccounts();
    const cfd_accounts = useCFDAllAccounts();
    // TODO remove this mock when we're to switch to API data
    demo_platform_account = {
        account_category: 'trading',
        account_type: 'standard',
        loginid: 'VRTCMOCK0001',
        is_virtual: 1,
        landing_company_shortcode: shortcode as 'svg' | 'malta',
        token: '',
    };
    real_platform_accounts.push({
        account_category: 'trading',
        account_type: 'standard',
        loginid: 'CRMOCK0001',
        is_virtual: 0,
        landing_company_shortcode: shortcode as 'svg' | 'malta',
        token: '',
    });
    const accounts = [demo_platform_account, ...real_platform_accounts];
    const { getConfig } = useCurrencyConfig();

    const accountName = (is_virtual: boolean, currency: string, is_wallet: boolean) => {
        return `${is_virtual ? 'Demo' : ''} ${currency} ${is_wallet ? 'Wallet' : 'account'}`;
    };

    // TODO: refactor once we have useActiveWallet merged
    const current_wallet = wallets.find(wallet => wallet.loginid === loginid) as typeof wallets[number];

    // TODO remove this mock when we're to switch to API data
    const mock_transactions = is_demo
        ? [
              {
                  action_type: 'transfer',
                  amount: 5,
                  from: {
                      loginid,
                  },
                  to: {
                      loginid: 'VRTCMOCK0001',
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
                      loginid: 'VRTCMOCK0001',
                  },
                  to: {
                      loginid,
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
                  },
                  to: {
                      loginid: 'VRTCMOCK0001',
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
                  },
                  to: {
                      loginid: 'CRMOCK0001',
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
                  },
                  to: {
                      loginid: 'CRMOCK0001',
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
                      loginid: 'CRMOCK0001',
                  },
                  to: {
                      loginid,
                  },
                  balance_after: 750,
                  transaction_id: 17494415479,
                  transaction_time: 1685855738,
              },
              {
                  action_type: 'transfer',
                  amount: 200,
                  from: {
                      loginid: 'CRMOCK0001',
                  },
                  to: {
                      loginid,
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
                  },
                  to: {
                      loginid: 'CRMOCK0001',
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

    // @ts-expect-error reset_balance is not supported in the API yet
    const { data, isLoading, isSuccess } = useFetch('statement', {
        options: { keepPreviousData: true },
        ...(!!action_type && {
            payload: {
                action_type,
            },
        }),
    });

    // TODO: un-comment this code when we're to switch to API data
    // const transactions = data?.statement?.transactions?.filter(
    //     el =>
    //         !!el.action_type &&
    //         ['deposit', 'withdrawal', 'initial_fund', 'reset_balance', 'transfer'].includes(el.action_type)
    // ) as TWalletTransaction[];

    const transactions = (mock_transactions as Required<Statement>['transactions']).filter(
        el => !action_type || el.action_type === action_type
    ) as TWalletTransaction[];

    const modified_transactions = transactions
        .map(transaction => {
            if (
                transaction.amount === undefined ||
                transaction.balance_after === undefined ||
                transaction.action_type === undefined
            )
                return null;
            let account_category = 'wallet';
            let account_type = current_wallet.account_type;
            let account_name = current_wallet.name;
            let account_currency = current_wallet.currency;
            let icon = current_wallet.icon;
            let icon_type = current_wallet.icon_type;
            if (transaction.action_type === 'transfer') {
                const other_loginid =
                    transaction.to?.loginid === loginid ? transaction.from?.loginid : transaction.to?.loginid;
                if (!other_loginid) return null;
                const other_account = accounts.find(el => el.loginid === other_loginid);
                if (
                    !other_account ||
                    !other_account.currency ||
                    !other_account.account_category ||
                    !other_account.account_type
                )
                    return null;
                account_category = other_account.account_category;
                account_currency = other_account.currency;
                account_name = accountName(
                    !!other_account.is_virtual,
                    other_account.currency,
                    other_account.account_category === 'wallet'
                );
                account_type = other_account.account_type;
                icon = getWalletCurrencyIcon(
                    other_account.is_virtual ? 'demo' : other_account.currency || '',
                    is_dark_mode_on,
                    false
                );
                const currency_config = getConfig(account_currency);
                const is_crypto = currency_config?.is_crypto;
                icon_type = is_crypto ? 'crypto' : 'fiat';
            }

            return {
                ...transaction,
                account_category,
                account_currency,
                account_name,
                account_type,
                icon,
                icon_type,
            };
        })
        .filter(<T>(value: T | null): value is T => value !== null);

    return { transactions: modified_transactions, isLoading, isSuccess };
};

export default useWalletTransactions;
