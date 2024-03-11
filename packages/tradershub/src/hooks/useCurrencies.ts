import { useCallback, useMemo } from 'react';
import { reorderCurrencies } from '@/helpers';
import {
    useAccountStatus,
    useActiveTradingAccount,
    useAuthorize,
    useCFDAccountsList,
    useLandingCompany,
    useQuery,
} from '@deriv/api-v2';
import useRegulationFlags from './useRegulationFlags';

type TWebsiteStatus = NonNullable<ReturnType<typeof useQuery<'website_status'>>['data']>['website_status'];
export type TCurrencyConfig = NonNullable<TWebsiteStatus>['currencies_config'][string] & {
    id?: string;
    isAdded?: boolean;
};

export type TCurrencies = {
    CRYPTO: TCurrencyConfig[];
    FIAT: TCurrencyConfig[];
};

/** A custom hook to get the currency config information from `website_status` endpoint and in predefined order */
const useCurrencies = () => {
    const { data: authorizeData, isLoading: isAuthorizeLoading, isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: websiteStatusData, isLoading: isWebsiteStatusLoading, ...rest } = useQuery('website_status');
    const { data: landingCompanyData, isLoading: isLandingCompanyLoading } = useLandingCompany();
    const { data: activeDerivTradingAccount } = useActiveTradingAccount();
    const { data: accountStatus } = useAccountStatus();
    const { data: cfdAccountsList } = useCFDAccountsList();

    const { data: statements } = useQuery('statement', {
        options: {
            enabled: !!websiteStatusData || isAuthorizeSuccess,
        },
    });

    const { isNonEU } = useRegulationFlags();

    // Get the legal allowed currencies based on the landing company
    const legalAllowedCurrencies = useMemo(() => {
        if (!landingCompanyData) return [];
        if (isNonEU) {
            return landingCompanyData.gaming_company?.legal_allowed_currencies;
        }

        return landingCompanyData.financial_company?.legal_allowed_currencies;
    }, [isNonEU, landingCompanyData]);

    // Check if the currency is already added to the account list to disable the currency
    const isAdded = useCallback(
        (currency: string) => {
            const currencyAccount = authorizeData?.account_list?.find(account => account.currency === currency);
            if (!currencyAccount) return false;

            const { currency: accountCurrency, landing_company_name: landingCompany } = currencyAccount;

            return accountCurrency === currency && landingCompany !== 'virtual';
        },
        [authorizeData?.account_list]
    );

    // Get the currency config and reorder the currencies based on the predefined order
    const currencyConfig = useMemo(() => {
        if (!websiteStatusData?.website_status?.currencies_config) return;
        const currencies: TCurrencies = {
            FIAT: [],
            CRYPTO: [],
        };

        // map the currencies to their respective types (FIAT or CRYPTO) with their id
        Object.entries(websiteStatusData?.website_status?.currencies_config)
            .filter(([key]) => legalAllowedCurrencies?.includes(key))
            .forEach(([key, value]) => {
                if (value.type === 'fiat') {
                    currencies.FIAT.push({
                        ...value,
                        id: key,
                        isAdded: isAdded(key),
                    });
                } else {
                    currencies.CRYPTO.push({ ...value, id: key, isAdded: isAdded(key) });
                }
            });

        // reorder the currencies based on the predefined order
        return {
            FIAT: reorderCurrencies(currencies.FIAT, 'FIAT'),
            CRYPTO: reorderCurrencies(currencies.CRYPTO, 'CRYPTO'),
        };
    }, [websiteStatusData?.website_status?.currencies_config, isAdded, legalAllowedCurrencies]);

    // Check if all the crypto currencies are already added to the account list
    const allCryptoCurrenciesAreAdded = useMemo(
        () => currencyConfig?.CRYPTO.every(currency => currency.isAdded) ?? false,
        [currencyConfig?.CRYPTO]
    );

    // Get the current account currency with its config and isAdded status
    const currentAccountCurrencyConfig = useMemo(() => {
        if (!authorizeData?.currency || !websiteStatusData?.website_status?.currencies_config) return;

        return {
            ...websiteStatusData?.website_status?.currencies_config[authorizeData?.currency],
            id: authorizeData?.currency,
        };
    }, [authorizeData?.currency, websiteStatusData?.website_status?.currencies_config]);

    // Get the added fiat currency with its config
    const addedFiatCurrency = useMemo(() => {
        return currencyConfig?.FIAT.find(currency => currency.isAdded);
    }, [currencyConfig?.FIAT]);

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

    return {
        ...rest,
        data: currencyConfig,
        isLoading: isAuthorizeLoading || isWebsiteStatusLoading || isLandingCompanyLoading,
        allCryptoCurrenciesAreAdded,
        currentAccountCurrencyConfig,
        addedFiatCurrency,
        disableFiatCurrencies,
    };
};

export default useCurrencies;
