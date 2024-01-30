import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';

declare global {
    interface WindowEventMap {
        queryChange: CustomEvent;
    }
}

type TSetQueryStringOptions = {
    clearAllQueries?: boolean;
};

type TQueryString = {
    advertId?: string;
    form?: string;
    modal?: string;
    paymentMethodId?: string;
    tab?: string;
};

function mergeParams(params1: URLSearchParams, params2: URLSearchParams) {
    const payload1 = paramsToPayload(params1);
    const payload2 = paramsToPayload(params2);
    const formattedParams = payloadToParams({
        ...payload1,
        ...payload2,
    });

    return formattedParams;
}

const payloadToParams = (payload: TQueryString) => new URLSearchParams(Object.entries(payload));
const paramsToPayload = (params: URLSearchParams) => Object.fromEntries(params.entries());
const queryEvent = new Event('queryChange');

// TODO: Add validations for query strings once My Profile page is merged
// type TQueryStringConfig = {
//     tab?: {
//         default: string;
//         values: string[];
//     };
// };

/**
 * A hook that syncs URL params to the rendering lifecycle.
 * You can use this hook to conditionally render tabs, forms or other screens based on what the current URL parameters are.
 * For instance, `/p2p-v2/my-profile?tab=Stats`:
 * - calling this hook returns `queryString` which is a Map that has a key of `tab` and value of `Stats`
 * - You can use this to conditionally render the `Stats` tab screen by checking if `queryString.get('tab') === 'Stats'`
 *
 * This avoids props drilling for passing boolean screen setters into its child components to switch between different screens/tabs
 */
function useQueryString() {
    const [params, setParams] = useState(() => new URLSearchParams(window.location.search));
    const history = useHistory();

    const syncParamsWithLifecycle = () => {
        const newParams = new URLSearchParams(window.location.search);
        history.replace({
            pathname: location.pathname,
            search: newParams.toString(),
        });
        setParams(newParams);
    };

    useEventListener('queryChange', syncParamsWithLifecycle);

    function replaceQueryString<T extends keyof TQueryString>(queryString: Record<T, TQueryString[T]>) {
        const replacedParams = payloadToParams(queryString);

        history.replace({
            pathname: window.location.pathname,
            search: replacedParams.toString(),
        });
        setParams(replacedParams);
        dispatchEvent(queryEvent);
    }

    function deleteQueryString<T extends keyof TQueryString>(key: T) {
        const newPayload = paramsToPayload(params);
        delete newPayload[key];
        const newParams = payloadToParams(newPayload);

        history.replace({
            pathname: window.location.pathname,
            search: newParams.toString(),
        });
        setParams(newParams);
        dispatchEvent(queryEvent);
    }

    function setQueryString<T extends keyof TQueryString>(
        queryStrings: Record<T, TQueryString[T]>,
        options?: TSetQueryStringOptions
    ) {
        const newParams = options?.clearAllQueries
            ? payloadToParams(queryStrings)
            : mergeParams(params, payloadToParams(queryStrings));

        history.replace({
            pathname: window.location.pathname,
            search: newParams.toString(),
        });
        setParams(newParams);
        dispatchEvent(queryEvent);
    }

    return {
        deleteQueryString,
        queryString: params,
        replaceQueryString,
        setQueryString,
    };
}

export default useQueryString;
