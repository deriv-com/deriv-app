import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TSocketEndpointNames } from '../types';

type TOptions = Parameters<ReturnType<typeof useQueryClient>['removeQueries']>[1];

/** A custom hook to remove query/queries by key */
const useRemoveQuery = () => {
    const queryClient = useQueryClient();

    const remove = useCallback(
        <T extends TSocketEndpointNames>(name: T | T[], options?: TOptions) => {
            return queryClient.removeQueries(Array.isArray(name) ? name : [name], options);
        },
        [queryClient]
    );

    return remove;
};

export default useRemoveQuery;
