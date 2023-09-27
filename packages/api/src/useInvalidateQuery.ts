import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TSocketEndpointNames } from '../types';

type TOptions = Parameters<ReturnType<typeof useQueryClient>['invalidateQueries']>[1];

const useInvalidateQuery = () => {
    const queryClient = useQueryClient();

    const invalidate = useCallback(
        <T extends TSocketEndpointNames>(name: T | T[], options?: TOptions) => {
            return queryClient.invalidateQueries(Array.isArray(name) ? name : [name], options);
        },
        [queryClient]
    );

    return invalidate;
};

export default useInvalidateQuery;
