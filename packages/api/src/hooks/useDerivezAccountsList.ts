import { useMemo } from 'react';
import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';
import useDerivezServiceToken from './useDerivezServiceToken';

/** A custom hook that gets the list of created DerivEz accounts. */
const useDerivezAccountsList = () => {
    const { isSuccess } = useAuthorize();
    const { data: derivez_accounts } = useQuery('trading_platform_accounts', {
        payload: { platform: 'derivez' },
        options: { enabled: isSuccess },
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
