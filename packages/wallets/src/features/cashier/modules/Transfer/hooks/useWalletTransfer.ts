import { useMemo } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig, useTransferAccounts } from '@deriv/api';
import { displayMoney } from '@deriv/api/src/utils/display-money';
import { getAccountName } from '../helpers';

type TAccountType = NonNullable<
    NonNullable<ReturnType<typeof useTransferAccounts>['data']>['accounts']
>[number]['account_type'];
type TMt5MarketType = ReturnType<typeof getMarketType>;

//TODO: remove this function when market_type will be added to transfer_between_accounts response in API
const getMarketType = (mt5Group?: string) => {
    if (mt5Group?.includes('financial')) return 'financial';
    if (mt5Group?.includes('synthetic')) return 'synthetic';
    if (mt5Group?.includes('all')) return 'all';
    return 'all';
};

const activeWalletIconMapper = {
    AUD: {
        dark: 'IcWalletCurrencyAud',
        light: 'IcWalletCurrencyAud',
    },
    BTC: {
        dark: 'IcWalletBitcoinDark',
        light: 'IcWalletEthereumLight',
    },
    Demo: {
        dark: 'IcWalletDerivDemoDark',
        light: 'IcWalletDerivDemoLight',
    },
    ETH: {
        dark: 'IcWalletEthereumDark',
        light: 'IcWalletBitcoinLight',
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
            dark: 'IcWalletMt5Financial',
            light: 'IcWalletMt5Financial',
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

const getAppIcon = (accountType: TAccountType, mt5MarketType: TMt5MarketType) => {
    if (!accountType) return '';
    if (accountType === 'mt5') return appIconMapper.mt5[mt5MarketType]?.light;
    //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
    return appIconMapper[accountType]?.light;
};

const useWalletTransfer = (fromAccountLoginId?: string) => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();
    const { data, isLoading: isTransferAccountsLoading } = useTransferAccounts();

    const isLoading =
        isAuthorizeLoading || isTransferAccountsLoading || isCurrencyConfigLoading || isActiveWalletLoading;

    const modifiedTransferAccounts = useMemo(() => {
        //populating transfer accounts with new fields
        const accounts = data?.accounts?.map(account => {
            const currencyConfig = account.currency ? getConfig(account.currency) : undefined;

            return {
                ...account,
                accountName: getAccountName({
                    //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
                    accountCategory: account.account_category,
                    accountType: account.account_type,
                    displayCurrencyCode: currencyConfig?.display_code,
                    mt5MarketType: getMarketType(account.mt5_group),
                }),
                activeWalletIcon: activeWallet?.is_virtual
                    ? activeWalletIconMapper.Demo.light
                    : activeWalletIconMapper[activeWallet?.currency as keyof typeof activeWalletIconMapper].light,
                appIcon:
                    //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
                    account.account_category === 'trading'
                        ? getAppIcon(account?.account_type, getMarketType(account.mt5_group))
                        : '',
                currencyConfig,
                displayBalance: displayMoney(Number(account.balance) || 0, currencyConfig?.display_code || 'USD', {
                    fractional_digits: currencyConfig?.fractional_digits || 2,
                    preferred_language: authorizeData?.preferred_language || 'en-US',
                }),
                isVirtual: Boolean(account.demo_account),
                landingCompanyName: activeWallet?.landing_company_name,
            };
        });

        //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
        const tradingAccounts = accounts?.filter(account => account.account_category === 'trading') || [];
        //@ts-expect-error provide proper type for accounts from transfer_between_accounts response
        const walletAccounts = accounts?.filter(account => account.account_category === 'wallet') || [];

        return { tradingAccounts, walletAccounts };
    }, [
        activeWallet?.currency,
        activeWallet?.is_virtual,
        activeWallet?.landing_company_name,
        authorizeData?.preferred_language,
        data?.accounts,
        getConfig,
    ]);

    const modifiedActiveWallet = useMemo(() => {
        return modifiedTransferAccounts.walletAccounts.find(account => account.loginid === activeWallet?.loginid);
    }, [activeWallet?.loginid, modifiedTransferAccounts.walletAccounts]);

    const toAccountList = useMemo(() => {
        if (fromAccountLoginId === activeWallet?.loginid) {
            return {
                tradingAccounts: modifiedTransferAccounts.tradingAccounts,
                walletAccounts: modifiedTransferAccounts.walletAccounts.filter(
                    account => account.loginid !== activeWallet?.loginid
                ),
            };
        }
        return { tradingAccounts: [], walletAccounts: [modifiedActiveWallet] };
    }, [
        activeWallet?.loginid,
        fromAccountLoginId,
        modifiedActiveWallet,
        modifiedTransferAccounts.tradingAccounts,
        modifiedTransferAccounts.walletAccounts,
    ]);

    return {
        activeWallet: modifiedActiveWallet,
        fromAccountList: modifiedTransferAccounts,
        isLoading,
        toAccountList,
    };
};

export default useWalletTransfer;
