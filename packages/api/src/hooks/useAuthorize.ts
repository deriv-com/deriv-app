import { useEffect, useMemo } from 'react';
import { getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';
import useFetch from '../useFetch';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = (token?: string) => {
    const current_token = getActiveAuthTokenIDFromLocalStorage();

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: token || current_token || '' },
        options: { enabled: Boolean(current_token) },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    useEffect(() => {
        if (current_token !== token) {
            // Todo: Update the token in the localStorage since we are switching the current account.
        }
    }, [current_token, token]);

    return {
        /** The authorize response. */
        data: modified_authorize,
        ...rest,
    };
};

export default useAuthorize;
