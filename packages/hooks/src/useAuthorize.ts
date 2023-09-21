import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';

/** A custom hook that authorize the user with the given token. If no token is given, it will use the current token. */
const useAuthorize = (token?: string) => {
    const current_token = getActiveAuthTokenIDFromLocalStorage();
    const auth_token = token || current_token || '';

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: auth_token },
        options: { enabled: Boolean(auth_token) },
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
