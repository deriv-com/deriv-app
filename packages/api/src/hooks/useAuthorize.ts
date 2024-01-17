import { useCallback, useMemo, useState } from 'react';
import { getActiveAuthTokenIDFromLocalStorage, getActiveLoginIDFromLocalStorage } from '@deriv/utils';
import useInvalidateQuery from '../useInvalidateQuery';
import useQuery from '../useQuery';
import { useAPIContext } from '../APIProvider';
import useRefetchQuery from '../useRefetchQuery';
/** A custom hook that authorize the user with the given token. If no token is given,
 * it will use the current token from localStorage.
 */
const useAuthorize = () => {
    const current_token = getActiveAuthTokenIDFromLocalStorage();
    const invalidate = useInvalidateQuery();
    const { switchEnvironment } = useAPIContext();

    const [count, setCount] = useState(0);

    // @ts-ignore
    // console.log('>> useAuthorize, setting useQuery, for loginid: ',  window.getLoginByToken(current_token));

    const { data, isLoading, ...rest } = useQuery('authorize', {
        payload: { authorize: current_token || '' },
        options: { enabled: Boolean(current_token) },
    });

        
    const switchAccount = (loginid: string) => {
            const active_loginid = getActiveLoginIDFromLocalStorage();
            if (active_loginid !== loginid) {
                // @ts-ignore
                console.log('>> switchAccount from useAuthorise, desired login, active login, context login, count ', loginid, active_loginid, window.getLoginByToken(current_token), count);
                localStorage.setItem('active_loginid', loginid);
                switchEnvironment(active_loginid);
                setCount(count + 1);
                // invalidate('authorize');           
            }
    }

    return {
        /** The authorize response. */
        data: { ...data?.authorize },
        /** Function to switch to another account */
        switchAccount,
        isLoading,
        count, 
        ...rest,
    };
};

export default useAuthorize;
