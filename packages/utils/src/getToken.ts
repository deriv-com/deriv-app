import getAccountsFromLocalStorage from './getAccountsFromLocalStorage';

/**
 * Gets the current user's auth `token` for the active `loginid` from the `localStorage`.
 */
const getToken = (loginid: string) => {
    const accounts = getAccountsFromLocalStorage() ?? {};

    // If there is no active loginid or no accounts list, return undefined.
    if (!loginid) return;

    return accounts[loginid]?.token;
};

export default getToken;
