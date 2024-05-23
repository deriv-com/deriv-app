export type TAccount = {
    login?: string;
};

/**
 * Sorts an array of accounts by the login property in ascending order.
 *
 * @template T
 * @param {T[]} arr - The array of accounts to be sorted
 * @returns {T[]} - The sorted array of accounts
 */

export function sortAccountList<T extends TAccount>(arr: T[]) {
    return arr.sort((a, b) => {
        const loginA = a?.login;
        const loginB = b?.login;

        if (loginA && loginB) {
            if (loginA < loginB) {
                return -1;
            }
            if (loginA > loginB) {
                return 1;
            }
        }
        return 0;
    });
}
