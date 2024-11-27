import { useMemo } from 'react';
import { useActiveWalletAccount, useCurrencyConfig, useTradingPlatformStatus } from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { THooks, TWalletLandingCompanyName } from '../../../../../types';
import { CFD_PLATFORMS } from '../../../../cfd/constants';
import { PlatformDetails } from '../../../constants';
import { getAccountName, getLandingCompanyNameOfMT5Account } from '../../../helpers';

type TCFDPlatform = Exclude<typeof CFD_PLATFORMS[keyof typeof CFD_PLATFORMS], 'CFDs'>;

/** A custom hook that enhances the transfer accounts response by adding additional properties for convenient UI rendering. */
const useExtendedTransferAccountProperties = (accounts?: THooks.TransferAccount[]) => {
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();
    const { getPlatformStatus } = useTradingPlatformStatus();

    const isLoading = isCurrencyConfigLoading || isActiveWalletLoading;

    const extendedTransferAccounts = useMemo(() => {
        //populating transfer accounts with extra fields
        const updatedAccounts = accounts?.map(account => {
            const currencyConfig = account.currency ? getConfig(account.currency) : undefined;
            const accountName = getAccountName({
                accountCategory: account.account_category,
                accountType: account.account_type,
                displayCurrencyCode: currencyConfig?.display_code,
                landingCompanyName: activeWallet?.landing_company_name as TWalletLandingCompanyName,
                mt5MarketType: account.market_type,
                product: account.product,
            });
            const displayBalance = displayMoney(Number(account.balance), currencyConfig?.display_code, {
                fractional_digits: currencyConfig?.fractional_digits,
            });
            const landingCompanyName =
                account.account_type === PlatformDetails.mt5.name
                    ? getLandingCompanyNameOfMT5Account(account.mt5_group)
                    : (activeWallet?.landing_company_name as TWalletLandingCompanyName);
            const isCFDAccount =
                account?.account_category === 'trading' &&
                [CFD_PLATFORMS.CTRADER, CFD_PLATFORMS.DXTRADE, CFD_PLATFORMS.MT5].includes(
                    account?.account_type as TCFDPlatform
                );

            return {
                ...account,
                accountName,
                currencyConfig,
                displayBalance,
                landingCompanyName,
                ...(isCFDAccount && {
                    platformStatus: getPlatformStatus(account.account_type ?? ''),
                }),
            } as const;
        });

        const tradingAccounts = updatedAccounts?.filter(account => account.account_category === 'trading') || [];
        const walletAccounts = updatedAccounts?.filter(account => account.account_category === 'wallet') || [];

        return { tradingAccounts, walletAccounts };
    }, [accounts, activeWallet?.landing_company_name, getConfig, getPlatformStatus]);

    const modifiedActiveWallet = useMemo(() => {
        return extendedTransferAccounts.walletAccounts.find(account => account.loginid === activeWallet?.loginid);
    }, [activeWallet?.loginid, extendedTransferAccounts.walletAccounts]);

    return { accounts: extendedTransferAccounts, activeWallet: modifiedActiveWallet, isLoading };
};

export default useExtendedTransferAccountProperties;
