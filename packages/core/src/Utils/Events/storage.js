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

export const getAllowedLocalStorageOrigin = () => {
    if (/^staging\.deriv\.app$/i.test(window.location.hostname)) {
        return 'https://smarttrader-staging.deriv.app';
    } else if (/^deriv\.app$/i.test(window.location.hostname)) {
        return 'https://smarttrader.deriv.app';
    }
    return false;
};
