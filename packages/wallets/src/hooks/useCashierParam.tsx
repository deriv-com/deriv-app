import { useCallback } from 'react';

export type TCashierParams = 'deposit' | 'transactions' | 'transfer' | 'withdraw';

const useCashierParam = () => {
    const getCashierParam = useCallback((param: TCashierParams) => {
        return `?&active-cashier-tab=${param}`;
    }, []);

    return getCashierParam;
};

export default useCashierParam;
