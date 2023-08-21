import getAccountsFromLocalStorage from './getAccountsFromLocalStorage';
import getActiveLoginIDFromLocalStorage from './getActiveLoginIDFromLocalStorage';

/**
 * Gets the current user's auth `token` for the active `loginid` from the `localStorage`.
 */
const getActiveAuthTokenIDFromLocalStorage = () => {
    const accounts = getAccountsFromLocalStorage();
    const active_loginid = getActiveLoginIDFromLocalStorage();

    // If there is no active loginid, then there is no active auth token.
    if (!active_loginid) return;

    const active_auth_token = accounts?.[active_loginid]?.token;

    return active_auth_token;
};

export default getActiveAuthTokenIDFromLocalStorage;
