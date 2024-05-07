import { useMemo } from 'react';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { THooks } from '../../../hooks/types';

type TModifiedAccounts = ReturnType<typeof getModifiedAccounts>;

type TLimits = {
    max: number;
    min: number;
};

const getTransferMinMaxLimits = (
    account: THooks.TransferAccounts[number],
    transferLimits?: THooks.CurrencyConfig['transfer_between_accounts']
) => {
    if (!transferLimits) return {};

    const {
        limits,
        limits_ctrader: limitsCTrader,
        limits_dxtrade: limitsDXTrade,
        limits_mt5: limitsMT5,
    } = transferLimits;

    switch (account.account_type) {
        case 'ctrader':
            return {
                max: limitsCTrader?.max,
                min: limitsCTrader?.min,
            } as TLimits;
        case 'dxtrade':
            return {
                max: limitsDXTrade?.max,
                min: limitsDXTrade?.min,
            } as TLimits;
        case 'mt5':
            return {
                max: limitsMT5?.max,
                min: limitsMT5?.min,
            } as TLimits;
        default:
            return {
                max: limits?.max,
                min: limits?.min,
            } as TLimits;
    }
};

const getModifiedAccounts = (accounts: THooks.TransferAccounts, getConfig: THooks.GetCurrencyConfig) => {
    return accounts.map(account => {
        const currencyConfig = getConfig(account.currency ?? 'USD');

        return {
            ...account,
            currencyConfig,
            displayBalance: displayMoney(Number(account.balance), account.currency ?? '', {
                fractional_digits: currencyConfig?.fractional_digits,
            }),
            limits: getTransferMinMaxLimits(account, currencyConfig?.transfer_between_accounts),
        };
    });
};

const sortedMT5Accounts = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'mt5');
};

const derivCTrader = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'ctrader');
};

const derivXAccount = (accounts: TModifiedAccounts) => accounts.filter(account => account.account_type === 'dxtrade');

const fiatDerivAccounts = (accounts: TModifiedAccounts) => {
    return accounts.filter(account => account.account_type === 'binary' && account.currencyConfig?.is_fiat);
};

const sortedCryptoDerivAccounts = (accounts: TModifiedAccounts) => {
    return accounts
        .filter(account => account.account_type === 'binary' && account.currencyConfig?.is_crypto)
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

const useExtendedTransferAccounts = (
    activeAccount: THooks.ActiveAccount,
    getConfig: THooks.GetCurrencyConfig,
    accounts: THooks.TransferAccounts = []
) => {
    const modifiedAccounts = getModifiedAccounts(accounts, getConfig);

    const sortedTransferableAccounts = useMemo(() => {
        return [
            ...sortedMT5Accounts(modifiedAccounts),
            ...derivCTrader(modifiedAccounts),
            ...derivXAccount(modifiedAccounts),
            ...fiatDerivAccounts(modifiedAccounts),
            ...sortedCryptoDerivAccounts(modifiedAccounts),
        ];
    }, [modifiedAccounts]);

    const transferableActiveAccount = modifiedAccounts.find(account => account.loginid === activeAccount.loginid);

    return {
        accounts: sortedTransferableAccounts,
        activeAccount: transferableActiveAccount,
    };
};

export default useExtendedTransferAccounts;
