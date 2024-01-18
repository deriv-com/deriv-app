import { useCallback, useMemo } from 'react';
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
    const { switchEnvironment } = useAPIContext();

    const { data, ...rest } = useQuery('authorize', {
        payload: { authorize: current_token || '' },
        options: { enabled: Boolean(current_token) },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    const switchAccount = useCallback(
        (loginid: string) => {
            const active_loginid = getActiveLoginIDFromLocalStorage();
            if (active_loginid !== loginid) {
                localStorage.setItem('active_loginid', loginid);
                switchEnvironment(active_loginid);
                invalidate('authorize');
            }
        },
        [invalidate, switchEnvironment]
    );

    return {
        /** The authorize response. */
        data: modified_authorize,
        /** Function to switch to another account */
        switchAccount,
        ...rest,
    };
};

export default useAuthorize;
