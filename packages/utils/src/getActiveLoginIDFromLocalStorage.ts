/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
const getActiveLoginIDFromLocalStorage = (loginIDKey?: string) => {
    const active_loginid =
        localStorage.getItem(loginIDKey ?? 'active_loginid') || localStorage.getItem('active_loginid');

    // If there is no active loginid, return undefined.
    if (!active_loginid) return;

    return active_loginid;
};

export default getActiveLoginIDFromLocalStorage;
