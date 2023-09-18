import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created other CFD accounts. */
const useDerivezAccountsList = () => {
    const { data: ctrader_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'ctrader' },
    });

    /** Adding neccesary properties to dxtrade accounts */
    const modified_derivez_accounts = useMemo(
        () =>
            ctrader_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
            })),
        [ctrader_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created other CFD accounts */
        data: modified_derivez_accounts,
    };
};

export default useDerivezAccountsList;
