import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

const useGetPasskeysList = () => {
    const { isSuccess } = useAuthorize();

    const { data, ...rest } = useQuery('passkeys_list', {
        options: {
            enabled: isSuccess,
        },
    });

    return {
        data: data?.passkeys_list,
        ...rest,
    };
};

export default useGetPasskeysList;
