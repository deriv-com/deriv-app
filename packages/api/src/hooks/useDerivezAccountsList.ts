import { useMemo } from 'react';
import useDerivezServiceToken from './useDerivezServiceToken';
import useFetch from '../useFetch';

/** A custom hook that gets the list of created DerivEz accounts. */
const useDerivezAccountsList = () => {
    const { data: derivez_accounts } = useFetch('trading_platform_accounts', {
        payload: { platform: 'derivez' },
    });
    const { data: token } = useDerivezServiceToken();

    /** Adding necessary properties to DerivEz accounts */
    const modified_derivez_accounts = useMemo(
        () =>
            derivez_accounts?.trading_platform_accounts?.map(account => ({
                ...account,
                /** The id for the account */
                loginid: account.account_id,
                /** The token for the account */
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
