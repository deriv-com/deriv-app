import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TSocketEndpointNames } from '../types';

const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    const invalidate = useCallback(
        <T extends TSocketEndpointNames>(name: T) => queryClient.invalidateQueries([name]),
        [queryClient]
    );

    return invalidate;
};

export default useInvalidateQuery;
