import { useQueryClient } from '@tanstack/react-query';
import { TSocketEndpointNames } from '../types';

const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    return <T extends TSocketEndpointNames>(name: T) => queryClient.invalidateQueries([name]);
};

export default useInvalidateQuery;
