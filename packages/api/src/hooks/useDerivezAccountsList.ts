import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created DerivEz accounts. */
const useDerivezAccountsList = () => {
    const { data: derivez_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });

    /** Adding neccesary properties to DerivEz accounts */
    const modified_derivez_accounts = useMemo(
        () =>
            derivez_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                /** The id of the DerivEz account */
                id: account.account_id,
            })),
        [derivez_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created DerivEz accounts */
        data: modified_derivez_accounts,
    };
};

export default useDerivezAccountsList;
