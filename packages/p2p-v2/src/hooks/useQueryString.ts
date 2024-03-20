import { StringParam, useQueryParams } from 'use-query-params';

/**
 * A hook that uses `use-query-params` to sync URL params to the React lifecycle
 * You can use this hook to conditionally render tabs, forms or other screens based on what the current URL parameters are.
 * For instance, `/p2p-v2/my-profile?tab=Stats`:
 * - calling this hook returns `queryString` which is an object that has a key of `tab` and value of `Stats`
 * - You can use this to conditionally render the `Stats` tab screen by checking if `queryString.tab === 'Stats'`
 *
 * This avoids props drilling for passing boolean screen setters into its child components to switch between different screens/tabs.
 *
 * @example
 * // Call the hook and render the tab based on `?=tab...`
 * const { queryString } = useQueryString()
 *
 * if (queryString.tab === 'Stats') {
 *      // Show Stats component
 * }
 */
function useQueryString() {
    const [query, setQuery] = useQueryParams({
        advertId: StringParam,
        modal: StringParam,
        paymentMethodId: StringParam,
        tab: StringParam,
    });
    /**
     * Removes the query string from the URL search string.
     * The rest of the query strings will be preserved.
     *
     * @param key - The search name to delete from the search string
     *
     * @example
     * // Deletes the search name `tab` from the URL search string.
     * // p2p-v2/my-profile?tab=Stats&modal=NicknameModal` ->  p2p-v2/my-profile?modal=NicknameModal`
     * deleteQueryString('tab')
     */
    function deleteQueryString(key: keyof typeof query) {
        setQuery(
            {
                [key]: undefined,
            },
            'pushIn'
        );
    }

    /**
     * Add or replace a query string from the URL search string.
     * The rest of the query strings will not be replaced unless specified in the argument.
     *
     * @param queryStrings - An object with the key as the search name, and value as the search value
     *
     * @example
     * // Set a new query string 'modal' and replace the current query string 'tab' with 'Payment methods'
     * // p2p-v2/my-profile?tab=Stats ->  p2p-v2/my-profile?tab=Payment+methods&modal=NicknameModal`
     * setQueryString({
     *      modal: 'NicknameModal',
     *      tab: 'Payment methods'
     * })
     */
    function setQueryString(queryStrings: Parameters<typeof setQuery>[0]) {
        setQuery(queryStrings, 'pushIn');
    }

    return {
        deleteQueryString,
        queryString: query,
        setQueryString,
    };
}

export default useQueryString;
