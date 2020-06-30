export const setStorageEvents = root_store => {
    window.addEventListener('storage', evt => {
        switch (evt.key) {
            case 'active_loginid':
                if (document.hidden) {
                    window.location.reload();
                }
                break;
            case 'reality_check_dismissed':
                if (document.hidden) {
                    // if new value is true, hide reality check, otherwise show it
                    root_store.client.setVisibilityRealityCheck(!JSON.parse(evt.newValue));
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
