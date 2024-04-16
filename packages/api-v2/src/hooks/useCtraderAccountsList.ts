import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';
import useCurrencyConfig from './useCurrencyConfig';
import { displayMoney } from '../utils';
import useExchangeRates from './useExchangeRates';
import useTradingAccountsList from './useTradingAccountsList';

/** A custom hook that gets the list of created cTrader accounts. */
const useCtraderAccountsList = () => {
    const { data: authorize_data, isSuccess } = useAuthorize();
    const { data: ctrader_accounts, ...rest } = useQuery('trading_platform_accounts', {
        payload: { platform: 'ctrader' },
        options: { enabled: isSuccess },
    });
    const { getConfig } = useCurrencyConfig();
    const { fiat_account } = useTradingAccountsList();
    const { getExchangeRate } = useExchangeRates();

    /** Adding neccesary properties to cTrader accounts */
    const modified_ctrader_accounts = useMemo(
        () =>
            ctrader_accounts?.trading_platform_accounts?.map(account => {
                const balance = account.balance ?? 0;
                return {
                    ...account,
                    /** Account's currency config information */
                    currency_config: account.currency ? getConfig(account.currency) : undefined,
                    /** The id of the cTrader account */
                    id: account.account_id,
                    /** indicating whether the account is a virtual-money account. */
                    is_virtual: account.account_type === 'demo',
                    /** Landing company shortcode the account belongs to. */
                    landing_company_name: account.landing_company_short,
                    /** The platform of the account */
                    platform: 'ctrader' as const,
                    /** Formatted display balance */
                    formatted_balance: displayMoney(account.balance || 0, account.currency || 'USD', {
                        preferred_language: authorize_data?.preferred_language,
                    }),
                    /** Converted balance from the exchange rate */
                    converted_balance: getExchangeRate(fiat_account, account.currency ?? 'USD') * balance,
                };
            }),
        [
            authorize_data?.preferred_language,
            fiat_account,
            getConfig,
            getExchangeRate,
            ctrader_accounts?.trading_platform_accounts,
        ]
    );
    return {
        /** List of all created cTrader accounts */
        data: modified_ctrader_accounts,
        ...rest,
    };
};

export default useCtraderAccountsList;
