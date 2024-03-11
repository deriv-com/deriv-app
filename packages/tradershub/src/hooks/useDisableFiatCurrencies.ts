import { useMemo } from 'react';
import { useAccountStatus, useActiveTradingAccount, useCFDAccountsList, useQuery } from '@deriv/api-v2';
import useCurrencies from './useCurrencies';

/**
 * @name useDisableFiatCurrencies
 * @description A custom React hook that returns a boolean to disable fiat currencies based on the account status and the current account currency.
 * @returns {boolean} - The boolean to disable fiat currencies.
 */
const useDisableFiatCurrencies = () => {
    const { data: activeDerivTradingAccount } = useActiveTradingAccount();
    const { data: accountStatus, isSuccess: isAccountStatusSuccess } = useAccountStatus();
    const { data: cfdAccountsList } = useCFDAccountsList();
    const { currentAccountCurrencyConfig, addedFiatCurrency } = useCurrencies();
    const { data: statements } = useQuery('statement', {
        options: {
            enabled: isAccountStatusSuccess,
        },
    });
    // NOTE: redesign the logic to make it more readable and maintainable
    // Disable fiat currencies if the current account currency is not fiat or if the account is deposit attempt
    const disableFiatCurrencies = useMemo(
        () =>
            // if the current account currency is not fiat
            (!!addedFiatCurrency && currentAccountCurrencyConfig?.type !== 'fiat') ||
            // if there is balance in the account and the current account currency is fiat
            (!!activeDerivTradingAccount?.balance && currentAccountCurrencyConfig?.type === 'fiat') ||
            // if the account is deposit attempt and the current account currency is fiat
            (currentAccountCurrencyConfig?.type === 'fiat' &&
                accountStatus?.is_deposit_attempt &&
                !!cfdAccountsList?.dxtrade && // if there is no dxtrade account
                !!cfdAccountsList.mt5 && // if there is no mt5 account
                !!statements?.statement?.count && // if there are transactions in the account
                !!statements.statement?.transactions?.length),
        [
            accountStatus?.is_deposit_attempt,
            activeDerivTradingAccount?.balance,
            addedFiatCurrency,
            cfdAccountsList?.dxtrade,
            cfdAccountsList?.mt5,
            currentAccountCurrencyConfig?.type,
            statements?.statement?.count,
            statements?.statement?.transactions,
        ]
    );

    return disableFiatCurrencies;
};

export default useDisableFiatCurrencies;
