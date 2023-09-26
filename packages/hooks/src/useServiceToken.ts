import { useQuery } from '@deriv/api';
import { TSocketRequestPayload } from '@deriv/api/types';

type TServiceTokenPayload = TSocketRequestPayload<'service_token'>['payload'];

/**
 * Hook to get the service token for using 3rd party SDK
 * @name useServiceToken
 * @param payload to be sent while making the API call
 * @returns response and its status
 */
const useServiceToken = (payload: TServiceTokenPayload) => {
    const { data, ...rest } = useQuery('service_token', {
        payload,
        options: { retry: 3, enabled: Boolean(payload) },
    });

    return {
        service_token: data?.service_token,
        ...rest,
    };
};

export default useServiceToken;
