import useQuery from '../useQuery';
import useAuthorize from './useAuthorize';

const useLoginHistoryData = (limit_value: number) => {
    const { isSuccess } = useAuthorize();

    const { data, ...loginHistoryDataRest } = useQuery('login_history', {
        options: { enabled: isSuccess },
        payload: { limit: limit_value },
    });

    return {
        loginHistory: data?.login_history,
        ...loginHistoryDataRest,
    };
};
export default useLoginHistoryData;
