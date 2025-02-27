import { useCallback, useMemo, useState } from 'react';
import { getActiveAuthTokenIDFromLocalStorage, getActiveLoginIDFromLocalStorage } from '@deriv/utils';
import useInvalidateQuery from '../useInvalidateQuery';
import useQuery from '../useQuery';
import { useAPIContext } from '../APIProvider';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const current_token = getActiveAuthTokenIDFromLocalStorage();
    const invalidate = useInvalidateQuery();
    const { switchEnvironment, queryClient } = useAPIContext();

    const [currentLoginID, setCurrentLoginID] = useState(getActiveLoginIDFromLocalStorage());

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
                sessionStorage.setItem('active_loginid', loginid);
                localStorage.setItem('active_loginid', loginid);
                switchEnvironment(active_loginid);
                // whenever we change the loginid, we need to invalidate all queries
                // as there might be ongoing queries against previous loginid
                // and we really do not want data from previous loginid, to be mixed with current loginid
                queryClient.cancelQueries();
                setCurrentLoginID(loginid);
            }
        },
        [invalidate, switchEnvironment, currentLoginID]
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
