// TODO: Refactor using data transformation layer pattern when we will have API for wallets (e.g. wallet.icon)
// TODO: move it to @deriv/utils package later
export const getWalletCurrencyIcon = (currency: string, is_dark_mode_on: boolean, is_modal = false) => {
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

// TODO: move it to @deriv/utils package later
// must be TWalletAccount[] type, but this type is in hooks package
export const sortWalletAccounts = (accounts: any[]) => {
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

// TODO: delete it when wallets API starts to work
// must be TWalletAccount[] type, but it's in hooks package
export const fake_wallet_accounts: any[] = [
    {
        name: 'USD',
        currency: 'USD',
        icon: getWalletCurrencyIcon('USD', false),
        balance: '10,784',
        icon_type: 'fiat',
        landing_company_shortcode: 'svg',
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10001',
    },
    {
        name: 'Demo USD',
        currency: 'USD',
        icon: getWalletCurrencyIcon('demo', false),
        balance: '10,0000',
        icon_type: 'fiat',
        landing_company_shortcode: 'svg',
        is_disabled: false,
        is_virtual: true,
        loginid: 'CRW10002',
    },
    {
        name: 'AUD',
        currency: 'AUD',
        icon: getWalletCurrencyIcon('AUD', false),
        balance: '5,374',
        icon_type: 'fiat',
        landing_company_shortcode: 'svg',
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10001',
    },
    {
        name: 'Bitcoin',
        currency: 'BTC',
        icon: getWalletCurrencyIcon('BTC', false),
        balance: '2.34',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10001',
    },
    {
        name: 'EUR',
        currency: 'EUR',
        balance: '10,784.73',
        icon_type: 'fiat',
        landing_company_shortcode: 'malta',
        icon: getWalletCurrencyIcon('EUR', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10001',
    },
    {
        name: 'USD',
        currency: 'USD',
        balance: '3,231.05',
        icon_type: 'fiat',
        landing_company_shortcode: 'malta',
        icon: getWalletCurrencyIcon('USD', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'MFW10005',
    },
    {
        name: 'ETH',
        currency: 'ETH',
        balance: '0.012342',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('ETH', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10007',
    },
    {
        name: 'LTC',
        currency: 'LTC',
        balance: '1.2342',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('LTC', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10007',
    },
    {
        name: 'USDC',
        currency: 'USDC',
        balance: '3.064',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('USDC', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10008',
    },
    {
        name: 'USDT',
        currency: 'USDT',
        balance: '1.064',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('USDT', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10009',
    },
    {
        name: 'eUSDT',
        currency: 'eUSDT',
        balance: '5.034',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('eUSDT', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10010',
    },
    {
        name: 'tUSDT',
        currency: 'tUSDT',
        balance: '0.111',
        icon_type: 'crypto',
        landing_company_shortcode: 'svg',
        icon: getWalletCurrencyIcon('tUSDT', false),
        is_disabled: false,
        is_virtual: false,
        loginid: 'CRW10011',
    },
];
