/**
 * Get accounts from localStorage
 * @returns {Record<string, any>} - object of accounts
 */
const getAccountsFromLocalStorage = (): Record<string, any> => {
    const accounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');

    return accounts;
};

export default getAccountsFromLocalStorage;
