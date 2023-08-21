/**
 * Gets the active `loginid` for the current user from the `localStorage`.
 */
const getActiveLoginIDFromLocalStorage = () => {
    const active_loginid = localStorage.getItem('active_loginid');

    return active_loginid;
};

export default getActiveLoginIDFromLocalStorage;
