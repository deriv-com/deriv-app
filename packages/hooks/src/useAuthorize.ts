import { useMemo } from 'react';

import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

/** A custom hook that authorize the user with the given token. If no token is given, it will use the current token. */
const useAuthorize = (token?: string) => {
    const { client } = useStore();
    const { accounts, loginid = '' } = client;
    const current_token = accounts[loginid || '']?.token;

    const { data, ...rest } = useFetch('authorize', {
        payload: { authorize: token ?? current_token },
        options: { enabled: Boolean(token ?? current_token), refetchOnWindowFocus: false },
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
