/**
 * Calculates the total balance from a list of accounts.
 *
 * @template T - A type extending the CTraderAccount type.
 * @param {T[]} accountsList - An array of accounts, each potentially containing a `display_balance` property.
 * @returns {string} The total balance of all accounts in the list, formatted as a string with two decimal places.
 */
export type CTraderAccount = {
    // eslint-disable-next-line camelcase
    display_balance?: number | string | null;
};

export function calculateTotalBalance(accountsList: CTraderAccount[]): string {
    return accountsList
        .reduce((acc, cur) => {
            let balance = 0;
            if (typeof cur?.display_balance === 'number') {
                balance = cur.display_balance;
            } else if (typeof cur?.display_balance === 'string') {
                const parsedBalance = parseFloat(cur.display_balance);
                if (!isNaN(parsedBalance)) {
                    balance = parsedBalance;
                }
            }
            return acc + balance;
        }, 0)
        .toFixed(2);
}
