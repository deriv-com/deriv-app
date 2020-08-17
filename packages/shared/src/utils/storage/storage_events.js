export const getUrlSmartTrader = () => {
    // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    if (
        /^staging\.deriv\.app$/i.test(window.location.hostname) ||
        /^staging-app\.deriv\.com$/i.test(window.location.hostname)
    ) {
        return 'https://staging-smarttrader.deriv.com';
    }

    return 'https://smarttrader.deriv.com';
};
