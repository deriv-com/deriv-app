import React from 'react';
import useRequest from '../useRequest';

type TAPITokenPayload = NonNullable<
    NonNullable<NonNullable<Parameters<ReturnType<typeof useRequest<'api_token'>>['mutate']>>[0]>['payload']
>;
const useSetApiToken = () => {
    const { data, mutate, ...rest } = useRequest('api_token');

    const update = React.useCallback((payload?: TAPITokenPayload) => mutate({ payload }), [mutate]);

    return {
        updated_api_token_data: data,
        update,
        ...rest,
    };
};

export default useSetApiToken;
