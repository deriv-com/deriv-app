import { useMemo } from 'react';
import { useFetch } from '@deriv/api';
import { getActiveAuthTokenIDFromLocalStorage } from '@deriv/utils';

/** A custom hook that authorize the user with the given token. If no token is given, it will use the current token. */
const useAuthorize = (token?: string) => {
    const current_token = getActiveAuthTokenIDFromLocalStorage() || '';

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: token || current_token },
        options: { keepPreviousData: true },
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
