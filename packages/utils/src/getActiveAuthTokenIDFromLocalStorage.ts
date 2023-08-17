import getAccountsFromLocalStorage from './getAccountsFromLocalStorage';
import getActiveLoginIDFromLocalStorage from './getActiveLoginIDFromLocalStorage';

/**
 * Get active auth token
 * @returns {string} - Active auth token or empty string
 */
const getActiveAuthTokenIDFromLocalStorage = (): string => {
    const accounts = getAccountsFromLocalStorage();
    const active_loginid = getActiveLoginIDFromLocalStorage();
    const active_auth_token = accounts?.[active_loginid]?.token || '';

    return active_auth_token;
};

export default getActiveAuthTokenIDFromLocalStorage;
