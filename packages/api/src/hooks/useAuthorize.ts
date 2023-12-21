import { useCallback, useMemo } from 'react';
import { getActiveAuthTokenIDFromLocalStorage, getActiveLoginIDFromLocalStorage } from '@deriv/utils';
import useInvalidateQuery from '../useInvalidateQuery';
import useQuery from '../useQuery';
import { useAPIContext } from '../APIProvider';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKeys } from '../utils';
import { WS } from '@deriv/shared';
import { useAuth } from '../AuthProvider';
/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    // const current_token = getActiveAuthTokenIDFromLocalStorage();
    const { activeToken, updateLoginId } = useAuth();
    const invalidate = useInvalidateQuery();
    // const { switchEnvironment } = useAPIContext();
    const queryClient = useQueryClient();

    const { data, ...rest } = useQuery('authorize', {
        payload: { authorize: activeToken || '' },
        options: { enabled: Boolean(activeToken) },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    const switchAccount = useCallback(
        (loginid: string) => {
            // const currentShit = getActiveAuthTokenIDFromLocalStorage();
            // const active_loginid = getActiveLoginIDFromLocalStorage();
            // if (active_loginid !== loginid) {
            //     localStorage.setItem('active_loginid', loginid);
            //     switchEnvironment(active_loginid);
            //     WS.authorized.ping({});
            //     queryClient.removeQueries({
            //         queryKey: getQueryKeys('authorize', { authorize: currentShit }),
            //     });
            //     invalidate('authorize');
            // }
            updateLoginId(loginid);
        },
        [updateLoginId]
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
