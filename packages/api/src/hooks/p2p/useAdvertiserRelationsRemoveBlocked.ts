import { useCallback } from 'react';
import useInvalidateQuery from '../../useInvalidateQuery';
import useMutation from '../../useMutation';

/** This hook unblocks advertisers of the current user by passing the advertiser id. */
const useAdvertiserRelationsRemoveBlocked = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_relations', {
        onSuccess: () => invalidate('p2p_advertiser_relations'),
    });

    const removeBlockedAdvertiser = useCallback(
        (id: number[]) => mutate({ payload: { remove_blocked: id } }),
        [mutate]
    );

    return {
        data,
        /** Sends a request to unblock advertiser of the current user by passing the advertiser id. */
        removeBlockedAdvertiser,
        ...rest,
    };
};

export default useAdvertiserRelationsRemoveBlocked;
