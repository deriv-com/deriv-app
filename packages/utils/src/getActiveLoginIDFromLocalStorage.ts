/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
const getActiveLoginIDFromLocalStorage = (loginIDKey = 'active_loginid') => {
    const active_custom_loginid = localStorage.getItem(loginIDKey);
    return active_custom_loginid ?? undefined;
};

export default getActiveLoginIDFromLocalStorage;
