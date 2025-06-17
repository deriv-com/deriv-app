const isTmbEnabled = async () => {
    // add deriv and impersonation check
    const isFromBo = document.referrer.includes('https://backoffice.binary.com');
    if (isFromBo) {
        sessionStorage.setItem('is_from_bo', 'true');
    }

    const sessionFromBo = sessionStorage.getItem('is_from_bo') === 'true';
    const storedValue = localStorage.getItem('is_tmb_enabled');
    try {
        const url =
            process.env.NODE_ENV === 'production'
                ? 'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
                : 'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json';
        const response = await fetch(url);
        const result = await response.json();
        return storedValue !== null ? storedValue === 'true' : !sessionFromBo && !!result.app;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // by default it will fallback to true if firebase error happens
        return storedValue !== null ? storedValue === 'true' : false;
    }
};

export default isTmbEnabled;
