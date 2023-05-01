import usePlatformAccounts from './usePlatformAccounts';
import { isCryptocurrency } from '@deriv/shared';
import { useStore } from '@deriv/stores';

const useRealTotalAssetCurrency = () => {
    const { client, traders_hub } = useStore();
    const { current_fiat_currency, is_crypto, currency, default_currency } = client;
    const { is_eu_user } = traders_hub;
    const { real: platform_real_accounts } = usePlatformAccounts();

    if (!platform_real_accounts.length) return default_currency;

    const non_crypto_accounts = platform_real_accounts.find(account => !isCryptocurrency(account.currency || 'USD'));

    if (non_crypto_accounts) {
        return non_crypto_accounts?.currency || '';
    }

    const currency_if_is_crypto = is_eu_user
        ? current_fiat_currency || default_currency
        : platform_real_accounts[0].currency;
    return is_crypto ? currency_if_is_crypto : currency;
};

export default useRealTotalAssetCurrency;

// list different scenarios for the useRealTotalAssetCurrency hook
// 1. if the user has a fiat account, return the currency of the fiat account
// 2. if the user has a crypto account, return the currency of the crypto account
// 3. if the user has both fiat and crypto accounts, return the currency of the fiat account
// 4. if the user has no accounts, return the default currency
// 5. if the user is an EU user, return the currency of the fiat account
// 6. if the user is not an EU user, return the currency of the first account in the list
// 7. if the user is not an EU user and has no accounts, return the currency of the first account in the list
// 8. if the user is not an EU user and has no accounts and is not crypto, return the currency of the first account in the list
// 9. if the user is not an EU user and has no accounts and is crypto, return the currency of the first account in the list
// 10. if the user is not an EU user and has no accounts and is crypto and has no currency, return the currency of the first account in the list
// 11. if the user is not an EU user and has no accounts and is crypto and has no currency and is not crypto, return the currency of the first account in the list
// 12. if the user is not an EU user and has no accounts and is crypto and has no currency and is crypto, return the currency of the first account in the list
