import { useMemo } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api';
import { displayMoney } from '@deriv/api/src/utils';
import { THooks, TWalletLandingCompanyName } from '../../../../../types';
import { getAccountName, getLandingCompanyNameOfMT5Account, getMarketType } from '../../../helpers';

/** A custom hook that enhances the transfer accounts response by adding additional properties for convenient UI rendering. */
const useExtendedTransferAccountProperties = (accounts?: THooks.TransferAccount[]) => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = isAuthorizeLoading || isCurrencyConfigLoading || isActiveWalletLoading;

    const extendedTransferAccounts = useMemo(() => {
        //populating transfer accounts with extra fields
        const updatedAccounts = accounts?.map(account => {
            const currencyConfig = account.currency ? getConfig(account.currency) : undefined;
            const accountName = getAccountName({
                accountCategory: account.account_category,
                accountType: account.account_type,
                displayCurrencyCode: currencyConfig?.display_code,
                landingCompanyName: activeWallet?.landing_company_name as TWalletLandingCompanyName,
                mt5MarketType: getMarketType(account.mt5_group),
            });
            const displayBalance = displayMoney(Number(account.balance) || 0, currencyConfig?.display_code || 'USD', {
                fractional_digits: currencyConfig?.fractional_digits,
                preferred_language: authorizeData?.preferred_language,
            });
            const landingCompanyName =
                account.account_type === 'mt5'
                    ? getLandingCompanyNameOfMT5Account(account.mt5_group)
                    : (activeWallet?.landing_company_name as TWalletLandingCompanyName);

            return {
                ...account,
                accountName,
                currencyConfig,
                displayBalance,
                landingCompanyName,
            } as const;
        });

        const tradingAccounts = updatedAccounts?.filter(account => account.account_category === 'trading') || [];
        const walletAccounts = updatedAccounts?.filter(account => account.account_category === 'wallet') || [];

        return { tradingAccounts, walletAccounts };
    }, [accounts, activeWallet?.landing_company_name, authorizeData?.preferred_language, getConfig]);

    const modifiedActiveWallet = useMemo(() => {
        return extendedTransferAccounts.walletAccounts.find(account => account.loginid === activeWallet?.loginid);
    }, [activeWallet?.loginid, extendedTransferAccounts.walletAccounts]);

    return { accounts: extendedTransferAccounts, activeWallet: modifiedActiveWallet, isLoading };
};

export default useExtendedTransferAccountProperties;
