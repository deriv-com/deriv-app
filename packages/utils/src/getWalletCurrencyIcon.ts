const getWalletCurrencyIcon = (currency: string, is_dark_mode_on = false, is_modal = false) => {
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
            return is_dark_mode_on ? 'IcWalletEthereumDark' : 'IcWalletEthereumLight';
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
            return '';
    }
};

export default getWalletCurrencyIcon;
