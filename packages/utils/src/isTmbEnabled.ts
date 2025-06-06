const isTmbEnabled = async () => {
    const storedValue = localStorage.getItem('is_tmb_enabled');
    try {
        const url =
            process.env.NODE_ENV === 'production'
                ? 'https://app-config-prod.firebaseio.com/remote_config/oauth/is_tmb_enabled.json'
                : 'https://app-config-staging.firebaseio.com/remote_config/oauth/is_tmb_enabled.json';
        const response = await fetch(url);
        const result = await response.json();
        return storedValue !== null ? storedValue === 'true' : !!result.app;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        // by default it will fallback to true if firebase error happens
        return storedValue !== null ? storedValue === 'true' : true;
    }
};

export default isTmbEnabled;
