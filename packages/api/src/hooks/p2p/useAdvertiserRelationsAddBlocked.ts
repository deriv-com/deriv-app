import { useCallback } from 'react';
import useInvalidateQuery from '../../useInvalidateQuery';
import useMutation from '../../useMutation';

/** This hook blocks advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsAddBlocked = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_relations', {
        onSuccess: () => invalidate('p2p_advertiser_relations'),
    });

    const addBlockedAdvertiser = useCallback((id: number[]) => mutate({ payload: { add_blocked: id } }), [mutate]);

    return {
        data,
        /** Sends a request to block advertiser of the current user by passing the advertiser id. */
        mutate: addBlockedAdvertiser,
        ...rest,
    };
};

export default useAdvertiserRelationsAddBlocked;
