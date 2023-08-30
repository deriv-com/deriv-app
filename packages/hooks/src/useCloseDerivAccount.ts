import { useRequest } from '@deriv/api';

const useCloseDerivAccount = () => {
    const { data, mutate, error, isError, isSuccess, isLoading } = useRequest('account_closure');
    return {
        data,
        mutate,
        error,
        isError,
        isSuccess,
        isLoading,
    };
};

export default useCloseDerivAccount;
