type CTraderAccount = {
    // eslint-disable-next-line camelcase
    display_balance?: number | string | null;
};

export function calculateTotalBalance<T extends CTraderAccount>(accountsList: T[]): string {
    return accountsList.reduce((acc, cur) => acc + +(cur?.display_balance || 0), 0).toFixed(2);
}
