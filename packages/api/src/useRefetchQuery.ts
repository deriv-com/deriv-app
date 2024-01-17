import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TSocketEndpointNames } from '../types';

type TOptions = Parameters<ReturnType<typeof useQueryClient>['invalidateQueries']>[1];

const useRefetchQuery = () => {
    const queryClient = useQueryClient();

    const invalidate = useCallback(
        <T extends TSocketEndpointNames>(name: T | T[], options?: TOptions) => {
            if (name == 'authorize') {
                //@ts-ignore
                console.log('>> invalidate from useRefetchQuery, localStorage.active_loginid', name, localStorage.active_loginid, window.getTokenByLoginId(localStorage.active_loginid));
                console.trace();
            }
            return queryClient.invalidateQueries(Array.isArray(name) ? name : [name], options);
        },
        [queryClient]
    );

    return invalidate;
};

export default useRefetchQuery;
