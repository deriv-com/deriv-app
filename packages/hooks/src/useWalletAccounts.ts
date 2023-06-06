import { useStore } from '@deriv/stores';

type TWalletAccount = {
    account_category?: 'trading' | 'wallet';
    account_type?: string;
    balance: string | number;
    currency: string;
    is_disabled: boolean;
    is_virtual: boolean;
    landing_company_shortcode: 'svg' | 'malta';
    loginid: string;
    icon: string;
    icon_type: 'fiat' | 'crypto' | 'all';
    name: string;
};

// TODO: Delete it later! Fake function! Will be replaced by original function from @deriv/shared
const isCryptocurrency = (currency: string) => {
    return currency !== 'USD' && currency !== 'AUD' && currency !== 'GBP' && currency !== 'EUR';
};

// TODO: Will be replaced by original function from @deriv/shared
const getWalletCurrencyIcon = (currency: string, is_dark_mode_on: boolean, is_modal = false) => {
    switch (currency) {
        case 'demo':
            if (is_modal) return 'IcWalletDerivDemoLight';
            return is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';
        case 'USD':
            return 'IcWalletCurrencyUsd';
        case 'EUR':
            return 'IcWalletCurrencyEur';
        case 'AUD':
            return 'IcWalletCurrencyAud';
        case 'GBP':
            return 'IcWalletCurrencyGbp';
        case 'BTC':
            return is_dark_mode_on ? 'IcWalletBitcoinDark' : 'IcWalletBitcoinLight';
        case 'ETH':
            return is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight';
        case 'USDT':
        case 'eUSDT':
        case 'tUSDT':
        case 'UST':
            if (is_modal) {
                return is_dark_mode_on ? 'IcWalletModalTetherDark' : 'IcWalletModalTetherLight';
            }
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'LTC':
            return is_dark_mode_on ? 'IcWalletLiteCoinDark' : 'IcWalletLiteCoinLight';
        case 'USDC':
            return is_dark_mode_on ? 'IcWalletUsdCoinDark' : 'IcWalletUsdCoinLight';
        default:
            return 'Unknown';
    }
};

export const sortWalletAccounts = (accounts: TWalletAccount[]) => {
    const fiat = accounts
        .filter(account => account.icon_type === 'fiat' && !account.is_virtual)
        .sort((a, b) => a.name.localeCompare(b.name));

    const crypro = accounts
        .filter(account => account.icon_type === 'crypto' && !account.is_virtual)
        .sort((a, b) => a.name.localeCompare(b.name));

    // there are not accounts this type in wallets API right now
    const dp2p = accounts
        .filter(account => account.currency === 'DP2P' && !account.is_virtual)
        .sort((a, b) => a.name.localeCompare(b.name));

    const demo = accounts.filter(account => account.is_virtual).sort((a, b) => a.name.localeCompare(b.name));

    return [...fiat, ...crypro, ...dp2p, ...demo];
};

const useWalletAccounts = (): TWalletAccount[] => {
    const {
        client: { accounts },
        ui: { is_dark_mode_on },
    } = useStore();

    const wallets = accounts
        ? Object.keys(accounts)
              .filter(key => accounts[key]?.account_category === 'wallet')
              .reduce((acc, cur) => {
                  if (!accounts[cur]) return acc;

                  const {
                      currency = 'USD',
                      account_category,
                      account_type,
                      balance = 0,
                      is_disabled,
                      is_virtual,
                      landing_company_shortcode,
                  } = accounts[cur];

                  const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
                  const name = is_virtual ? `Demo ${currency}` : currency;

                  acc.push({
                      account_category,
                      account_type,
                      balance,
                      currency,
                      is_disabled: !!is_disabled,
                      is_virtual: !!is_virtual,
                      landing_company_shortcode: landing_company_shortcode as 'svg' | 'malta',
                      loginid: cur,
                      icon: getWalletCurrencyIcon(is_virtual ? 'demo' : currency, is_dark_mode_on),
                      icon_type: is_fiat && !is_virtual ? 'fiat' : 'crypto',
                      name,
                  });

                  return acc;
              }, [] as TWalletAccount[])
        : [];

    return sortWalletAccounts(wallets);
};

export default useWalletAccounts;
