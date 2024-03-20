import { useMemo } from 'react';
import { useActiveAccount, useCurrencyConfig } from '@deriv/api-v2';
import { THooks } from '../../../hooks/types';

type TGetCurrencyConfig = ReturnType<typeof useCurrencyConfig>['getConfig'];

const sortedMT5Accounts = (accounts: THooks.TransferAccounts, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(account => account.account_type === 'mt5')
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));
};

const derivCTrader = (accounts: THooks.TransferAccounts, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(account => account.account_type === 'ctrader')
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));
};

const derivXAccount = (accounts: THooks.TransferAccounts, getConfig: TGetCurrencyConfig) =>
    accounts
        .filter(account => account.account_type === 'dxtrade')
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));

const fiatDerivAccounts = (accounts: THooks.TransferAccounts, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(
            account => account.account_type === 'binary' && account.currency && getConfig(account.currency)?.is_fiat
        )
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }));
};

const sortedCryptoDerivAccounts = (accounts: THooks.TransferAccounts, getConfig: TGetCurrencyConfig) => {
    return accounts
        .filter(
            account => account.account_type === 'binary' && account.currency && getConfig(account.currency)?.is_crypto
        )
        .map(account => ({
            ...account,
            currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
        }))
        .sort((prev, next) => {
            return prev.currency && next.currency ? prev.currency.localeCompare(next.currency) : 0;
        });
};

/**
    A hook which modifies the accounts received from `transfer_between_accounts` response as follows
    - appends `currency_config` data for each account
    - sorts the mt5 accounts based on group type
    - sorts the crypto accounts alphabetically
*/
const useExtendedTransferBetweenAccounts = (accounts: THooks.TransferAccounts) => {
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = !accounts || isActiveAccountLoading || isCurrencyConfigLoading;

    const extendedTransferableAccounts = useMemo(
        () =>
            !isLoading
                ? [
                      ...sortedMT5Accounts(accounts, getConfig),
                      ...derivCTrader(accounts, getConfig),
                      ...derivXAccount(accounts, getConfig),
                      ...fiatDerivAccounts(accounts, getConfig),
                      ...sortedCryptoDerivAccounts(accounts, getConfig),
                  ]
                : [],
        [accounts, isLoading, getConfig]
    );

    const transferableActiveAccount = useMemo(
        () =>
            !!extendedTransferableAccounts || !isLoading
                ? extendedTransferableAccounts?.find((account: typeof extendedTransferableAccounts[number]) => {
                      if (account.loginid === activeAccount?.loginid) {
                          return {
                              ...activeAccount,
                              currencyConfig: activeAccount?.currency ? getConfig(activeAccount.currency) : undefined,
                          };
                      }
                  })
                : undefined,
        [activeAccount, extendedTransferableAccounts, getConfig, isLoading]
    );

    return {
        accounts: extendedTransferableAccounts,
        activeAccount: transferableActiveAccount,
        isLoading: isLoading || !extendedTransferableAccounts.length || !transferableActiveAccount,
    };
};

export default useExtendedTransferBetweenAccounts;
