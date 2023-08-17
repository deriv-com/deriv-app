/**
 * Get active loginid from localStorage
 * @returns {string} - Active loginid
 */
const getActiveLoginIDFromLocalStorage = (): string => {
    const active_loginid = localStorage.getItem('active_loginid') || '';

    return active_loginid;
};

export default getActiveLoginIDFromLocalStorage;
