import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

/** A custom hook to get account limits */
const useAccountLimits = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('get_limits', { options: { enabled: isSuccess } });

    return {
        /** Account limits response */
        data: data?.get_limits,
        ...rest,
    };
};

export default useAccountLimits;
