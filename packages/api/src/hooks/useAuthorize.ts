import { useCallback, useMemo, useState } from 'react';
import { getAccountsFromLocalStorage, getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';
import useFetch from '../useFetch';

/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const [current_token, setCurrentToken] = useState(getActiveAuthTokenIDFromLocalStorage());

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: current_token || '' },
        options: { enabled: Boolean(current_token) },
    });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    const switchAccount = useCallback(
        (loginid: string) => {
            const accounts = getAccountsFromLocalStorage();
            const token = accounts?.[loginid]?.token;

            if (!token || token === current_token) return;

            setCurrentToken(token);
            localStorage.setItem('active_loginid', loginid);
        },
        [current_token]
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
