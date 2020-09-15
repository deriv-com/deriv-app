export const getUrlSmartTrader = () => {
    if (/^staging-app\.deriv\.com$/i.test(window.location.hostname)) {
        return 'https://staging-smarttrader.deriv.com';
    }

    if (/^staging-app\.derivcrypto\.com$/i.test(window.location.hostname)) {
        return 'https://staging-smarttrader.derivcrypto.com';
    }

    return 'https://smarttrader.deriv.com';
};
