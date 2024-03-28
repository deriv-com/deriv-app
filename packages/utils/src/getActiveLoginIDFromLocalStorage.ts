/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
const getActiveLoginIDFromLocalStorage = (loginid_key = 'active_loginid') => {
    const active_custom_loginid = localStorage.getItem(loginid_key);
    return active_custom_loginid ?? undefined;
};

export default getActiveLoginIDFromLocalStorage;
