export const setStorageEvents = () => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            // no default
        }
    });
};

export const getUrlSmartTrader = () => {
    // TODO: [app-link-refactor] - Remove backwards compatibility for `deriv.app`
    if (
        /^staging\.deriv\.app$/i.test(window.location.hostname) ||
        /^staging-app\.deriv\.com$/i.test(window.location.hostname)
    ) {
        return 'https://smarttrader-staging.deriv.com';
    }

    return 'https://smarttrader.deriv.com';
};
