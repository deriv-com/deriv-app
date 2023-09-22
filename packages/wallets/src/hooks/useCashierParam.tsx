import { useCallback } from 'react';

export type TCashierTabs = 'deposit' | 'transactions' | 'transfer' | 'withdraw';

const paramKey = 'active-cashier-tab';

/** A custom hook to get cashier active tab and setting the parameter */
const useCashierParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCashierTab = urlParams.get(paramKey);

    const getCashierParam = useCallback((param: TCashierTabs) => {
        return `&${paramKey}=${param}`;
    }, []);

    return {
        /** Current cashier tab */
        activeCashierTab,
        /** Function to get cashier query parameter */
        getCashierParam,
    };
};

export default useCashierParam;
