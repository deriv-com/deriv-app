import { useMemo } from 'react';
import useFetch from '../useFetch';
import useDerivezServiceToken from './useDerivezServiceToken';

/** A custom hook that gets the list of created DerivEz accounts. */
const useDerivezAccountsList = () => {
    const { data: derivez_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });
    const { data: token } = useDerivezServiceToken();

    /** Adding neccesary properties to DerivEz accounts */
    const modified_derivez_accounts = useMemo(
        () =>
            derivez_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                loginid: account.account_id,
                token,
            })),
        [derivez_accounts?.trading_platform_accounts, token]
    );

    return {
        /** List of all created DerivEz accounts */
        data: modified_derivez_accounts,
    };
};

export default useDerivezAccountsList;
