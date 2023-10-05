import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const current_token = getActiveAuthTokenIDFromLocalStorage();

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: current_token || '' },
        options: {
            enabled: Boolean(current_token),
            /** infinite cache. Invalidate it when the user creates new wallet or new DTrader account */
            staleTime: Infinity,
        },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    return {
        /** The authorize response. */
        data: modified_authorize,
        ...rest,
    };
};

export default useAuthorize;
