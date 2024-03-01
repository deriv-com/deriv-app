import { useActiveAccount, useCurrencyConfig } from '@deriv/api';
import { getMarketType } from '../../../helpers';
import { THooks } from '../../../hooks/types';

const sortedMT5Accounts = (accounts, getConfig) => {
    return [
        ...accounts.filter(account => {
            if (account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'synthetic')
                return {
                    ...account,
                    currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
                };
        }),
        ...accounts.filter(account => {
            if (account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'financial')
                return {
                    ...account,
                    currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
                };
        }),
        ...accounts.filter(account => {
            if (account.account_type === 'mt5' && getMarketType(account.mt5_group) === 'all')
                return {
                    ...account,
                    currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
                };
        }),
    ];
};

const derivCTrader = (accounts, getConfig) => {
    return (
        accounts.filter(account => {
            if (account.account_type === 'ctrader')
                return {
                    ...account,
                    currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
                };
        }) ?? []
    );
};

const derivXAccount = (accounts, getConfig) => {
    return (
        accounts.filter(account => {
            if (account.account_type === 'dxtrade')
                return {
                    ...account,
                    currencyConfig: account?.currency ? getConfig(account.currency) : undefined,
                };
        }) ?? []
    );
};

const fiatDerivAccounts = (accounts, getConfig) => {
    return (
        accounts.filter(account => {
            const config = getConfig(account.currency);

            if (account.account_type === 'binary' && config?.is_fiat)
                return {
                    ...account,
                    currencyConfig: account?.currency ? config : undefined,
                };
        }) ?? []
    );
};

const sortedCryptoDerivAccounts = (accounts, getConfig) => {
    return (
        accounts
            .filter(account => {
                const config = getConfig(account.currency);

                if (account.account_type === 'binary' && config?.is_crypto)
                    return {
                        ...account,
                        currencyConfig: account?.currency ? config : undefined,
                    };
            })
            .sort((prev, next) => prev.currency.localeCompare(next.currency)) ?? []
    );
};

const useExtendedTransferBetweenAccounts = (accounts: THooks.TransferAccount) => {
    const { data: activeAccount, isLoading: isActiveAccountLoading } = useActiveAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = !accounts || isActiveAccountLoading || isCurrencyConfigLoading;

    const extendedTransferableAccounts = !isLoading
        ? [
              ...sortedMT5Accounts(accounts, getConfig),
              ...derivCTrader(accounts, getConfig),
              ...derivXAccount(accounts, getConfig),
              ...fiatDerivAccounts(accounts, getConfig),
              ...sortedCryptoDerivAccounts(accounts, getConfig),
          ]
        : [];

    const transferableActiveAccount =
        !!extendedTransferableAccounts || !isLoading
            ? extendedTransferableAccounts?.find(
                  (account: typeof extendedTransferableAccounts[number]) => account.loginid === activeAccount?.loginid
              )
            : undefined;

    return {
        accounts: extendedTransferableAccounts,
        activeAccount: transferableActiveAccount,
        isLoading,
    };
};

export default useExtendedTransferBetweenAccounts;
