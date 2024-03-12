import { useQuery } from '@deriv/api';
import useAuthorize from './useAuthorize';

const useGetPasskeysList = (isFetchingAllowed: boolean) => {
    const { isSuccess, isFetching } = useAuthorize();

    const { data, error, isLoading, refetch, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: isSuccess && !isFetching && isFetchingAllowed,
        },
    });

    return {
        passkeys_list: data?.passkeys_list,
        passkeys_list_error: error?.error ?? null,
        reloadPasskeysList: refetch,
        is_passkeys_list_loading: isLoading,
        ...rest,
    };
};

export default useGetPasskeysList;
