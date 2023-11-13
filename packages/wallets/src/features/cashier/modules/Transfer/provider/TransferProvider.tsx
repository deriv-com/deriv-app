import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useActiveWalletAccount, useAuthorize, useCurrencyConfig, useTransferBetweenAccounts } from '@deriv/api';
import { displayMoney } from '@deriv/api/src/utils';
import { THooks } from '../../../../../types';
import { getAccountName } from '../helpers';

type TTransferContext = {
    accounts: ReturnType<typeof useModifyTransferAccounts>['accounts'];
    activeWallet: ReturnType<typeof useModifyTransferAccounts>['activeWallet'];
    isLoading: boolean;
    mutate: ReturnType<typeof useTransferBetweenAccounts>['mutate'];
};
type TAccountType = THooks.TransferAccount['account_type'];
type TMt5MarketType = ReturnType<typeof getMarketType>;

const TransferContext = createContext<TTransferContext | null>(null);

export const useTransfer = () => {
    const context = useContext(TransferContext);

    if (!context) throw new Error('useTransfer() must be called within a component wrapped in TransferProvider.');

    return context;
};

const useModifyTransferAccounts = (accounts?: THooks.TransferAccount[]) => {
    const { data: authorizeData, isLoading: isAuthorizeLoading } = useAuthorize();
    const { data: activeWallet, isLoading: isActiveWalletLoading } = useActiveWalletAccount();
    const { getConfig, isLoading: isCurrencyConfigLoading } = useCurrencyConfig();

    const isLoading = isAuthorizeLoading || isCurrencyConfigLoading || isActiveWalletLoading;

    const modifiedTransferAccounts = useMemo(() => {
        //populating transfer accounts with new/extra fields
        const updatedAccounts = accounts?.map(account => {
            const currencyConfig = account.currency ? getConfig(account.currency) : undefined;

            return {
                ...account,
                accountName: getAccountName({
                    accountCategory: account.account_category,
                    accountType: account.account_type,
                    displayCurrencyCode: currencyConfig?.display_code,
                    mt5MarketType: getMarketType(account.mt5_group),
                }),
                activeWalletIcon: activeWallet?.is_virtual
                    ? activeWalletIconMapper.Demo?.light
                    : activeWalletIconMapper[activeWallet?.currency as keyof typeof activeWalletIconMapper]?.light,
                appIcon:
                    account.account_category === 'trading'
                        ? getAppIcon(account?.account_type, getMarketType(account.mt5_group))
                        : '',
                currencyConfig,
                displayBalance: displayMoney(Number(account.balance) || 0, currencyConfig?.display_code || 'USD', {
                    fractional_digits: currencyConfig?.fractional_digits,
                    preferred_language: authorizeData?.preferred_language,
                }),
                isVirtual: Boolean(account.demo_account),
                landingCompanyName: activeWallet?.landing_company_name,
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

const TransferProvider = ({ children }: React.PropsWithChildren) => {
    const { data, isLoading: isTransferAccountsLoading, mutate } = useTransferBetweenAccounts();
    const { accounts, activeWallet, isLoading: isModifiedAccountsLoading } = useModifyTransferAccounts(data?.accounts);
    const isLoading = isTransferAccountsLoading || isModifiedAccountsLoading || !data;

    useEffect(() => {
        if (!data) mutate({ accounts: 'all' });
    }, [data, mutate]);

    return (
        <TransferContext.Provider value={{ accounts, activeWallet, isLoading, mutate }}>
            {children}
        </TransferContext.Provider>
    );
};

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

export default TransferProvider;
