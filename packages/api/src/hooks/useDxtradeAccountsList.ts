import { useMemo } from 'react';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created other CFD accounts. */
const useDxtradeAccountsList = () => {
    const { data: dxtrade_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'dxtrade' },
    });

    /** Adding neccesary properties to dxtrade accounts */
    const modified_dxtrade_accounts = useMemo(
        () =>
            dxtrade_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
            })),
        [dxtrade_accounts?.trading_platform_accounts]
    );

    return {
        /** List of all created other CFD accounts */
        data: modified_dxtrade_accounts,
    };
};

export default useDxtradeAccountsList;
