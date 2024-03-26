import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

const useLoginHistory = (limit_value: number) => {
    const { isSuccess } = useAuthorize();

    const { data, ...rest } = useQuery('login_history', {
        options: { enabled: isSuccess },
        payload: { limit: limit_value },
    });

    return {
        loginHistory: data?.login_history,
        ...rest,
    };
};
export default useLoginHistory;
