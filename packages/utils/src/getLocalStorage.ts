/**
 * Retrieves the value stored in localStorage for the given key.
 * @param {string} key - The localStorage key.
 * @returns {any} - The value stored in localStorage for the given key, or null if the key does not exist or has no value.
 */
export const getLocalStorage = (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};
