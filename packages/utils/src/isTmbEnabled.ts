const isTmbEnabled = async () => {
    const search = window.location.search;
    let platform;
    if (search) {
        const url_params = new URLSearchParams(search);
        platform = url_params.get('platform');
    }
    // add deriv and impersonation check
    const triggerImplicitFlow = platform === 'derivgo' || sessionStorage.getItem('is_disable_tmb') === 'true';

    if (triggerImplicitFlow) {
        sessionStorage.setItem('is_disable_tmb', 'true');
    }

    const storedValue = localStorage.getItem('is_tmb_enabled');
    try {
        const url =
            process.env.NODE_ENV === 'production'
                ? 'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
                : 'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json';
        const response = await fetch(url);
        const result = await response.json();
        return storedValue !== null ? storedValue === 'true' : !triggerImplicitFlow && !!result.app;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // by default it will fallback to true if firebase error happens
        return storedValue !== null ? storedValue === 'true' : false;
    }
};

export default isTmbEnabled;
