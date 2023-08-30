import { useFetch } from '@deriv/api';
const useAccountLimits = () => {
    const { data, ...rest } = useFetch('get_limits');
    const account_limits = data?.get_limits;

    return {
        account_limits,
        ...rest,
    };
};

export default useAccountLimits;
