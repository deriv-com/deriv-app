import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@deriv/stores';
import { getWalletCurrencyIcon } from '@deriv/utils';
import { useFetch } from '@deriv/api';
import useCurrencyConfig from './useCurrencyConfig';
import usePlatformAccounts from './usePlatformAccounts';
import useWalletList from './useWalletsList';
import useActiveWallet from './useActiveWallet';

const useWalletTransactions = (
    action_type: '' | 'deposit' | 'withdrawal' | 'initial_fund' | 'reset_balance' | 'transfer',
    page_count?: number
) => {
    const {
        client: { loginid },
        ui: { is_dark_mode_on },
    } = useStore();
    const { data: wallets } = useWalletList();
    const current_wallet = useActiveWallet();
    const { demo: demo_platform_account } = usePlatformAccounts();
    const { real: real_platform_accounts } = usePlatformAccounts();

    const accounts = [demo_platform_account, ...real_platform_accounts];
    const { getConfig } = useCurrencyConfig();

    const transactions_per_page = 10;

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

    const getTradingAccountName = (
        account_type: 'standard' | 'mt5' | 'dxtrade' | 'binary',
        is_virtual: boolean,
        landing_company_shortcode: 'svg' | 'malta'
    ) => {
        return `${trading_accounts_display_prefixes[account_type]} ${
            is_virtual ? 'Demo' : `(${landing_company_display_shortcodes[landing_company_shortcode]})`
        } account`;
    };

    const { data, isLoading, isSuccess } = useFetch('statement', {
        options: { keepPreviousData: true },
        payload: {
            // @ts-expect-error reset_balance is not supported in the API yet
            action_type: action_type || undefined,
            limit: page_count ? transactions_per_page : undefined,
            offset: page_count ? transactions_per_page * (page_count - 1) : 0,
        },
    });

    const [is_complete_list, setIsCompleteList] = useState(false);

    const [transactions, setTransactions] = useState<
        Required<Required<NonNullable<typeof data>>['statement']>['transactions']
    >([]);

    useEffect(() => {
        if (is_complete_list) return;
        if (data?.statement?.count === 0) setIsCompleteList(true);
        const new_transactions = data?.statement?.transactions;
        if (new_transactions && !isLoading && isSuccess) {
            setTransactions(prev => [...prev, ...new_transactions]);
        }
    }, [data?.statement, isLoading, isSuccess]);

    useEffect(() => {
        setIsCompleteList(false);
        setTransactions([]);
    }, [action_type]);

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
                          let account_name = current_wallet.name;
                          let account_currency = current_wallet.currency;
                          let gradient_class = current_wallet.gradient_card_class;
                          let icon = current_wallet.icon;
                          if (transaction.action_type === 'transfer') {
                              const other_loginid =
                                  transaction.to?.loginid === loginid
                                      ? transaction.from?.loginid
                                      : transaction.to?.loginid;
                              if (!other_loginid) return null;
                              const other_account = accounts.find(el => el?.loginid === other_loginid);
                              if (!other_account || !other_account.currency || !other_account.account_type) return null;
                              account_category = other_account.account_category || 'wallet';
                              account_currency = other_account.currency;
                              account_name =
                                  other_account.account_category === 'wallet'
                                      ? (
                                            wallets.find(
                                                el => el.loginid === other_account.loginid
                                            ) as typeof wallets[number]
                                        ).name
                                      : getTradingAccountName(
                                            other_account.account_type as 'standard' | 'mt5' | 'dxtrade' | 'binary',
                                            !!other_account.is_virtual,
                                            other_account.landing_company_shortcode as 'svg' | 'malta'
                                        );
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
        [accounts, current_wallet, getConfig, getTradingAccountName, is_dark_mode_on, loginid, transactions, wallets]
    );

    return { transactions: modified_transactions, isLoading, isSuccess, isComplete: is_complete_list };
};

export default useWalletTransactions;
