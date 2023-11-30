export default function generateOauthLoginFromAccounts(baseURL, accounts) {
    const url = new URL('/', baseURL);
    const params = new URLSearchParams();

    const query = accounts?.reduce((query, account, index) => {
        return {
            ...query,
            [`acct${index + 1}`]: account.id,
            [`token${index + 1}`]: account.token,
            [`cur${index + 1}`]: account.currency,
        };
    }, {});

    Object.entries(query || {}).forEach(([key, value]) => {
        params.append(key, String(value));
    });

    url.search = params.toString();

    return url;
}
