import { useMemo } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig } from '@deriv/api';
import { displayMoney } from '@deriv/api/src/utils';
import { THooks } from '../../../../../types';
import { getAccountName, getLandingCompanyNameOfMT5Account, getMarketType } from '../helpers';

type TAccountType = THooks.TransferAccount['account_type'];
type TMt5MarketType = ReturnType<typeof getMarketType>;

/** A custom hook that enhances the transfer accounts response by adding additional properties for convenient UI rendering. */
const useModifyTransferAccounts = (accounts?: THooks.TransferAccount[]) => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = isAuthorizeLoading || isCurrencyConfigLoading || isActiveWalletLoading;

    const modifiedTransferAccounts = useMemo(() => {
        //populating transfer accounts with extra fields
        const updatedAccounts = accounts?.map(account => {
            const currencyConfig = account.currency ? getConfig(account.currency) : undefined;
            const accountName = getAccountName({
                accountCategory: account.account_category,
                accountType: account.account_type,
                displayCurrencyCode: currencyConfig?.display_code,
                landingCompanyName: activeWallet?.landing_company_name,
                mt5MarketType: getMarketType(account.mt5_group),
            });
            const activeWalletIcon = activeWallet?.is_virtual
                ? activeWalletIconMapper.Demo?.light
                : activeWalletIconMapper[activeWallet?.currency as keyof typeof activeWalletIconMapper]?.light;
            const appIcon =
                account.account_category === 'trading'
                    ? getAppIcon(
                          account?.account_type,
                          //@ts-expect-error provide proper type for landing_company_name
                          activeWallet?.landing_company_name,
                          getMarketType(account.mt5_group)
                      )
                    : '';
            const displayBalance = displayMoney(Number(account.balance) || 0, currencyConfig?.display_code || 'USD', {
                fractional_digits: currencyConfig?.fractional_digits,
                preferred_language: authorizeData?.preferred_language,
            });
            const isVirtual = Boolean(account.demo_account);
            const landingCompanyName =
                account.account_type === 'mt5'
                    ? getLandingCompanyNameOfMT5Account(account.mt5_group)
                    : activeWallet?.landing_company_name;

            return {
                ...account,
                accountName,
                activeWalletIcon,
                appIcon,
                currencyConfig,
                displayBalance,
                isVirtual,
                landingCompanyName,
            };
        });

        const tradingAccounts = updatedAccounts?.filter(account => account.account_category === 'trading') || [];
        const walletAccounts = updatedAccounts?.filter(account => account.account_category === 'wallet') || [];

        return { tradingAccounts, walletAccounts };
    }, [
        accounts,
        activeWallet?.currency,
        activeWallet?.is_virtual,
        activeWallet?.landing_company_name,
        authorizeData?.preferred_language,
        getConfig,
    ]);

    const modifiedActiveWallet = useMemo(() => {
        return modifiedTransferAccounts.walletAccounts.find(account => account.loginid === activeWallet?.loginid);
    }, [activeWallet?.loginid, modifiedTransferAccounts.walletAccounts]);

    return { accounts: modifiedTransferAccounts, activeWallet: modifiedActiveWallet, isLoading };
};

export default useModifyTransferAccounts;

const activeWalletIconMapper = {
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletBitcoinLight',
    },
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletEthereumLight',
    },
    EUR: {
        dark: 'IcWalletCurrencyEur',
        light: 'IcWalletCurrencyEur',
    },
    eUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    GBP: {
        dark: 'IcWalletCurrencyGbp',
        light: 'IcWalletCurrencyGbp',
    },
    LTC: {
        dark: 'IcWalletLiteCoinDark',
        light: 'IcWalletLiteCoinLight',
    },
    tUST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
    USD: {
        dark: 'IcWalletCurrencyUsd',
        light: 'IcWalletCurrencyUsd',
    },
    USDC: {
        dark: 'IcWalletUsdCoinDark',
        light: 'IcWalletUsdCoinLight',
    },
    UST: {
        dark: 'IcWalletTetherDark',
        light: 'IcWalletTetherLight',
    },
} as const;

const appIconMapper = {
    binary: {
        dark: 'IcWalletOptionsDark',
        light: 'IcWalletOptionsLight',
    },
    ctrader: {
        dark: 'IcWalletCTrader',
        light: 'IcWalletCTrader',
    },
    derivez: {
        dark: 'IcWalletDerivEZ',
        light: 'IcWalletDerivEZ',
    },
    dxtrade: {
        dark: 'IcWalletDerivX',
        light: 'IcWalletDerivX',
    },
    mt5: {
        all: {
            dark: 'IcWalletMt5All',
            light: 'IcWalletMt5All',
        },
        financial: {
            malta: {
                dark: 'IcWalletMt5CFDs',
                light: 'IcWalletMt5CFDs',
            },
            svg: {
                dark: 'IcWalletMt5Financial',
                light: 'IcWalletMt5Financial',
            },
        },
        synthetic: {
            dark: 'IcWalletMt5Derived',
            light: 'IcWalletMt5Derived',
        },
    },
    standard: {
        dark: 'IcWalletOptionsDark',
        light: 'IcWalletOptionsLight',
    },
} as const;

const getAppIcon = (accountType: TAccountType, landingCompanyName: 'malta' | 'svg', mt5MarketType: TMt5MarketType) => {
    if (!accountType) return '';
    if (accountType === 'mt5') {
        if (mt5MarketType === 'financial') return appIconMapper.mt5.financial[landingCompanyName].light;
        return appIconMapper.mt5[mt5MarketType].light;
    }
    //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
    return appIconMapper[accountType].light;
};
