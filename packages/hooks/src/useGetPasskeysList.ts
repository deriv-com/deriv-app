import { useQuery } from '@deriv/api';
import useAuthorize from './useAuthorize';

const useGetPasskeysList = () => {
    const { isSuccess } = useAuthorize();

    const { data, error, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: isSuccess,
        },
    });

    return {
        data: data?.passkeys_list,
        error: error?.error ?? null,
        ...rest,
    };
};

export default useGetPasskeysList;
