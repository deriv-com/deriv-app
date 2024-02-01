import { useCallback, useMemo, useState } from 'react';
import {
    getAccountsFromLocalStorage,
    getActiveAuthTokenIDFromLocalStorage,
    getActiveLoginIDFromLocalStorage,
} from '@deriv/utils';
import useQuery from '../useQuery';
import { useAPIContext } from '../APIProvider';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const { switchEnvironment, queryClient, customLoginIDKey } = useAPIContext();
    const accounts = getAccountsFromLocalStorage();
    const firstAccount = Object.keys(accounts ?? {})[0];
    const [currentLoginID, setCurrentLoginID] = useState(getActiveLoginIDFromLocalStorage(customLoginIDKey));
    const current_token = getActiveAuthTokenIDFromLocalStorage(customLoginIDKey) ?? accounts?.[firstAccount]?.token;

    const { data, ...rest } = useQuery('authorize', {
        payload: { authorize: current_token || '' },
        options: {
            enabled: Boolean(current_token),
            // for authorise request - we cannot affort any race hazards due to it being randomly triggered
            // e.g. during the process of swithcing account or smth
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    const switchAccount = useCallback(
        (loginid: string) => {
            const active_loginid = getActiveLoginIDFromLocalStorage();
            if (active_loginid !== loginid) {
                localStorage.setItem(customLoginIDKey ?? 'active_loginid', loginid);
                switchEnvironment(active_loginid);
                // whenever we change the loginid, we need to invalidate all queries
                // as there might be ongoing queries against previous loginid
                // and we really do not want data from previous loginid, to be mixed with current loginid
                queryClient.cancelQueries();
                setCurrentLoginID(loginid);
            }
        },
        [customLoginIDKey, switchEnvironment, queryClient]
    );

    return {
        /** The authorize response. */
        data: modified_authorize,
        /** Function to switch to another account */
        switchAccount,
        currentLoginID,
        ...rest,
    };
};

export default useAuthorize;
