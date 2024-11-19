import { useQuery as _useQuery } from '@tanstack/react-query';
import type {
    TSocketEndpointNames,
    TSocketError,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';
import useAPI from './useAPI';
import { getQueryKeys } from './utils/query-utils';
import useAuthorize from './hooks/useAuthorize';

/**
 * just like useQuery, but only runs when user is authorized
 * plus, have couple extra option for more granular cache control
 *
 * default options are "safe", so its just gonna work correctly,
 * but if specific hook wants more granular control, then its that hook responsibility to understand the implications
 * e.g. useBalance with account=all does not need to be refetched when account is being switched,
 * but useBalance with account=123 does need to be refetched when account is being switched,
 *
 * unfortunatelly, there is missing bit of context/state - loginid, as normally its "hidden" in the connection,
 * its not a part of payload, thus, the standard "getKeys()" is just not enough, needs to add extra keys to handle user changing and switching
 *
 * @param name
 * @param payload
 * @param options
 * @param refreshOnAccountSwitch
 * @param refreshOnAccountAdded
 * @returns
 */
const useAuthorizedQuery = <T extends TSocketEndpointNames>(
    name: T,
    payload?: TSocketRequestPayload<T>['payload'],
    options?: TSocketRequestQueryOptions<T>,
    refreshOnAccountSwitch = true
) => {
    const { send } = useAPI();
    const { isSuccess, isLoading, loginid, data } = useAuthorize();

    // by default, we gonna invalidate cache when:
    //  - payload changed (as previously)
    //  - new account got added as this might have broader hard to predict implications
    const keys = [...getQueryKeys(name, payload), `${data?.account_list?.length}`];

    // also, we should invalidate cache when account is switched
    // though thats optional - some requests might not need to be refetched, e.g. accounts_list is global
    // balance: all is global so no need to refetch, etc,
    if (refreshOnAccountSwitch && loginid) {
        keys.push(loginid);
    }

    const isEnabled = typeof options?.enabled === 'boolean' ? options.enabled : true;

    return _useQuery<TSocketResponseData<T>, TSocketError<T>>(keys, () => send(name, payload), {
        ...options,
        enabled: !!(isSuccess && !isLoading && loginid && isEnabled),
    });
};

export default useAuthorizedQuery;
