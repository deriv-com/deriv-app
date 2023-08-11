import { useFetch, useInvalidateQuery, useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const useSettings = () => {
    const { client } = useStore();
    const { is_authorize } = client;

    const invalidate = useInvalidateQuery();

    const {
        data: fetch_data,
        refetch,
        ...rest_fetch
    } = useFetch('get_settings', {
        options: { enabled: is_authorize, refetchOnWindowFocus: false, initialData: { get_settings: {} } },
    });

    const { mutateAsync, ...rest_request } = useRequest('set_settings', {
        onSuccess: () => invalidate('get_settings'),
    });

    return {
        account_settings: fetch_data?.get_settings || {},
        getSettings: refetch,
        ...rest_fetch,
        setSettings: mutateAsync,
        mutate_params: rest_request,
    };
};

export default useSettings;
