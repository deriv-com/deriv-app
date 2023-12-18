import { useCallback, useMemo } from 'react';
import useMutation from '../../useMutation';
import useInvalidateQuery from '../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'p2p_advertiser_update'>>['mutate']>[0]['payload'];

/** A custom hook that updates a P2P advertiser. This can only be used by an approved P2P advertiser.
 *
 * To update an advertiser, specify the payload arguments that should be updated, for instance:
 * @example
 *  mutate({
        "is_listed": 0 // optional
        "upgrade_limits": 1  // optional
    });
 *
*/
const useUpdateAdvertiser = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_advertiser_update', {
        onSuccess: () => {
            invalidate('p2p_advertiser_list');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    const modified_data = useMemo(() => {
        const p2p_advertiser_update = data?.p2p_advertiser_update;
        if (!p2p_advertiser_update) return undefined;

        const { basic_verification, full_verification, is_approved, is_listed, is_online, show_name, created_time } =
            p2p_advertiser_update;

        return {
            ...p2p_advertiser_update,
            basic_verification: Boolean(basic_verification),
            /** Indicating whether the advertiser's address has been verified. */
            full_verification: Boolean(full_verification),
            /** The approval status of the advertiser. */
            is_approved: Boolean(is_approved),
            /** Indicates if the advertiser's active adverts are listed. When false, adverts won't be listed regardless if they are active or not. */
            is_listed: Boolean(is_listed),
            /** Indicates if the advertiser is currently online. */
            is_online: Boolean(is_online),
            /** When true, the advertiser's real name will be displayed on to other users on adverts and orders. */
            show_name: Boolean(show_name),
            /** The epoch time that the client became an advertiser. */
            created_time: created_time ? new Date(created_time) : undefined,
        };
    }, [data?.p2p_advertiser_update]);

    return {
        /** The updated 'p2p_advertiser' response. */
        data: modified_data,
        /** The mutated payload */
        mutate,
        ...rest,
    };
};

export default useUpdateAdvertiser;
