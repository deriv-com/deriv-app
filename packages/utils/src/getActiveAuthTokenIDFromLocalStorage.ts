import getAccountsFromLocalStorage from './getAccountsFromLocalStorage';
import getActiveLoginIDFromLocalStorage from './getActiveLoginIDFromLocalStorage';

/**
 * Gets the current user's auth `token` for the active `loginid` from the `localStorage`.
 */
const getActiveAuthTokenIDFromLocalStorage = (loginid_key?: string) => {
    const accounts = getAccountsFromLocalStorage();
    const active_loginid = getActiveLoginIDFromLocalStorage(loginid_key);

    // If there is no active loginid or no accounts list, return undefined.
    if (!active_loginid || !accounts) return;

    return accounts[active_loginid]?.token;
};

export default getActiveAuthTokenIDFromLocalStorage;
