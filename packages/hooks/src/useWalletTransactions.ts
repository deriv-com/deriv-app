import { useCallback, useMemo } from 'react';
import { useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import useActiveWallet from './useActiveWallet';
import useCurrencyConfig from './useCurrencyConfig';
import usePlatformAccounts from './usePlatformAccounts';
import useWalletsList from './useWalletsList';

const trading_accounts_display_prefixes = {
    standard: 'Deriv Apps',
    mt5: 'MT5',
    dxtrade: 'Deriv X',
    binary: 'Binary',
} as const;

const landing_company_display_shortcodes = {
    svg: 'SVG',
    malta: 'Malta',
} as const;

const useWalletTransactions = (
    action_type: '' | 'deposit' | 'withdrawal' | 'initial_fund' | 'reset_balance' | 'transfer'
) => {
    const {
        client: { loginid, landing_company_shortcode: shortcode },
        ui: { is_dark_mode_on },
    } = useStore();
    const { data: wallets } = useWalletsList();
    const current_wallet = useActiveWallet();
    let { demo: demo_platform_account } = usePlatformAccounts();
    const { real: real_platform_accounts } = usePlatformAccounts();

    // TODO remove these mocks when we're to switch to API data
    demo_platform_account = {
        account_category: 'trading',
        account_type: 'standard',
        currency: 'USD',
        loginid: 'VRTCMOCK0001',
        is_virtual: 1,
        landing_company_shortcode: shortcode as 'svg' | 'maltainvest',
        token: '',
    };
    real_platform_accounts.push({
        account_category: 'trading',
        account_type: 'standard',
        currency: 'USD',
        loginid: 'CRMOCK0001',
        is_virtual: 0,
        landing_company_shortcode: shortcode as 'svg' | 'maltainvest',
        token: '',
    });
    if (wallets && current_wallet)
        wallets.push({
            account_type: 'crypto',
            balance: 0,
            currency: 'BTC',
            gradient_header_class: 'wallet-header__btc-bg',
            gradient_card_class: `wallet-card__btc-bg${is_dark_mode_on ? '--dark' : ''}`,
            is_demo: !!current_wallet.is_virtual,
            is_disabled: 0,
            is_malta_wallet: false,
            is_selected: false,
            is_virtual: current_wallet.is_virtual,
            landing_company_name: 'svg',
            loginid: 'CRWMOCK00042',
            currency_config: undefined,
            icon: 'IcWalletCurrencyBtc',
            wallet_currency_type: 'BTC',
        });
    const accounts = useMemo(
        () => [demo_platform_account, ...real_platform_accounts],
        [demo_platform_account, real_platform_accounts]
    );
    const { getConfig } = useCurrencyConfig();

    const getTradingAccountName = useCallback(
        (
            account_type: 'standard' | 'mt5' | 'dxtrade' | 'binary',
            is_virtual: boolean,
            landing_company_shortcode: 'svg' | 'malta'
        ) => {
            return `${trading_accounts_display_prefixes[account_type]} ${
                is_virtual ? 'Demo' : `(${landing_company_display_shortcodes[landing_company_shortcode]})`
            } account`;
        },
        []
    );

    // TODO remove this mock when we're to switch to API data
    const mock_transactions = current_wallet?.is_virtual
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
                      loginid: 'CRWMOCK00042',
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
                      loginid: 'CRWMOCK00042',
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

    // const { isLoading, isSuccess } = useFetch('statement', {
    //     options: { keepPreviousData: true },
    //     payload: { action_type: },
    // });

    // TODO: un-comment this code when we're to switch to API data
    // const transactions = data?.statement?.transactions?.filter(
    //     el =>
    //         !!el.action_type &&
    //         ['deposit', 'withdrawal', 'initial_fund', 'reset_balance', 'transfer'].includes(el.action_type)
    // ) as TWalletTransaction[];

    const transactions = useMemo(
        () => mock_transactions.filter(el => !action_type || el.action_type === action_type),
        [action_type, mock_transactions]
    );

    const getTransferAccountName = useCallback(
        (other_account: Exclude<typeof accounts[number], undefined>) => {
            if (other_account.account_category === 'wallet') {
                const wallet = wallets?.find(el => el.loginid === other_account.loginid);
                return `${wallet?.is_virtual ? 'Demo ' : ''}${wallet?.currency} ${'Wallet'}`;
            }
            return getTradingAccountName(
                other_account.account_type as 'standard' | 'mt5' | 'dxtrade' | 'binary',
                !!other_account.is_virtual,
                other_account.landing_company_shortcode as 'svg' | 'malta'
            );
        },
        [getTradingAccountName, wallets]
    );

    const modified_transactions = useMemo(
        () =>
            wallets && current_wallet
                ? transactions
                      .map(transaction => {
                          if (
                              transaction.amount === undefined ||
                              transaction.balance_after === undefined ||
                              transaction.action_type === undefined
                          )
                              return null;

                          let account_category = 'wallet';
                          let account_type = current_wallet.account_type;
                          let account_name = `${current_wallet.is_virtual ? 'Demo ' : ''}${
                              current_wallet.currency
                          } ${'Wallet'}`;
                          let account_currency = current_wallet.currency;
                          let gradient_class = current_wallet.gradient_card_class;
                          let icon = getWalletCurrencyIcon(
                              current_wallet.is_virtual ? 'demo' : current_wallet.currency || 'USD',
                              is_dark_mode_on
                          );
                          if (transaction.action_type === 'transfer') {
                              const other_loginid =
                                  transaction.to?.loginid === loginid
                                      ? transaction.from?.loginid
                                      : transaction.to?.loginid;
                              if (!other_loginid) return null;
                              const other_account = accounts.find(el => el?.loginid === other_loginid);
                              if (!other_account?.currency || !other_account?.account_type) return null;
                              account_category = other_account.account_category || 'wallet';
                              account_currency = other_account.currency;
                              account_name = getTransferAccountName(other_account);
                              account_type = other_account.account_type;
                              gradient_class = `wallet-card__${
                                  other_account.is_virtual === 1 ? 'demo' : other_account?.currency?.toLowerCase()
                              }-bg${is_dark_mode_on ? '--dark' : ''}`;
                              icon = getWalletCurrencyIcon(
                                  other_account.is_virtual ? 'demo' : other_account.currency || '',
                                  is_dark_mode_on,
                                  false
                              );
                          }
                          const currency_config = getConfig(account_currency || '');
                          const is_crypto = currency_config?.is_crypto;
                          const icon_type = is_crypto || current_wallet.is_virtual ? 'crypto' : 'fiat';

                          return {
                              ...transaction,
                              account_category,
                              account_currency,
                              account_name,
                              account_type,
                              gradient_class,
                              icon,
                              icon_type,
                          };
                      })
                      .filter(<T>(value: T | null): value is T => value !== null)
                : [],
        [accounts, current_wallet, getConfig, getTransferAccountName, is_dark_mode_on, loginid, transactions, wallets]
    );

    return { transactions: modified_transactions, isLoading: false, isSuccess: true };
};

export default useWalletTransactions;
