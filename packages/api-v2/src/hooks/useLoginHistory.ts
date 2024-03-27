import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

const useLoginHistory = (limitValue: number) => {
    const { isSuccess } = useAuthorize();

    const { data, ...rest } = useQuery('login_history', {
        options: { enabled: isSuccess },
        payload: { limit: limitValue },
    });

    return {
        loginHistory: data?.login_history,
        ...rest,
    };
};
export default useLoginHistory;
