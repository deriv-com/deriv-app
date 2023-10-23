import useInvalidateQuery from '../useInvalidateQuery';
import useMutation from '../useMutation';

const useCreateWallet = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('new_account_wallet', {
        onSuccess: () => invalidate('authorize'),
    });

    const mutate = (params: Parameters<typeof _mutate>[0]['payload']) => {
        return _mutate({ payload: params });
    };

    return {
        data: data?.new_account_wallet,
        mutate,
        ...rest,
    };
};

export default useCreateWallet;
