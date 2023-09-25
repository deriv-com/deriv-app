import React from 'react';
import useRequest from '../useRequest';
import useInvalidateQuery from '../useInvalidateQuery';

type TAPITokenPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useRequest<'api_token'>>['mutate']>>[0]>['payload']
>;

type TDeleteAPITokenPayload = NonNullable<TAPITokenPayload>['delete_token'];
type TCreateAPITokenPayload = Omit<NonNullable<TAPITokenPayload>, 'delete_token'>;

/**
 * Makes an API call to GET, UPDATE or DELETE API token.
 * @name useApiToken
 * @returns an object containing the API token data, update function and status of the request/response.
 */
const useApiToken = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useRequest('api_token', {
        onSuccess: () => invalidate('api_token'),
    });

    /**
     * Makes an API call to GET API token.
     * @name getApiToken
     */
    const getApiToken = React.useCallback(() => mutate({}), [mutate]);

    /**
     * Makes an API call to CREATE API token.
     * @name createApiToken
     * @param payload - The name and scope of the API token.
     */
    const createApiToken = React.useCallback((payload: TCreateAPITokenPayload) => mutate({ payload }), [mutate]);

    /**
     * Makes an API call to DELETE API token.
     * @name deleteApiToken
     * @param value - The name of the API token.
     */
    const deleteApiToken = React.useCallback(
        (value: TDeleteAPITokenPayload) => mutate({ payload: { delete_token: value } }),
        [mutate]
    );

    return {
        api_token_data: data?.api_token,
        getApiToken,
        createApiToken,
        deleteApiToken,
        ...rest,
    };
};

export default useApiToken;
