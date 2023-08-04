import { useFetch } from '@deriv/api';
import { TSocketResponseData } from '@deriv/api/types';
import { useMemo } from 'react';

type TLocalStorageAccountsList = {
    [k: string]: {
        token: string;
        accepted_bch: number;
        landing_company_shortcode: string;
        residence: string;
        session_start: number;
    } & NonNullable<NonNullable<TSocketResponseData<'authorize'>['authorize']>['account_list']>[number];
};

/** A custom hook that authorize the user with the given token. If no token is given, it will use the current token. */
const useAuthorize = (token?: string) => {
    // Temporarily fix for getting the active token from local storage to avoid using `useStore`.
    // Should move this utility to `@deriv/utils` and make it reusable.
    const accounts: TLocalStorageAccountsList = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const active_loginid = localStorage.getItem('active_loginid');
    const current_token = accounts?.[active_loginid || ''].token;

    const { data, ...rest } = useFetch('authorize', { payload: { authorize: token || current_token } });

    // Add additional information to the authorize response.
    const modified_authorize = useMemo(() => ({ ...data?.authorize }), [data?.authorize]);

    return {
        /** The authorize response. */
        data: modified_authorize,
        ...rest,
    };
};

export default useAuthorize;
