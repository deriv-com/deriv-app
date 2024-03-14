import { useCallback, useMemo } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'p2p_advert_update'>>['mutate']>[0]['payload'];

/** A custom hook that deletes a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To delete an advert, specify the advert ID to delete, for instance:
 * @example
 *  mutate({
        "id": 1234
    });
 *
 * Once this is mutated, the advert with ID of 1234 will be deleted.
*/
const useAdvertDelete = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_advert_update', {
        onSuccess: () => {
            invalidate('p2p_advert_list');
            invalidate('p2p_advertiser_adverts');
        },
    });

    const mutate = useCallback(
        (payload: Omit<TPayload, 'delete'>) =>
            _mutate({
                payload: {
                    ...payload,
                    delete: 1,
                },
            }),
        [_mutate]
    );

    const modified_data = useMemo(() => {
        const p2p_advert_update = data?.p2p_advert_update;

        if (!p2p_advert_update) return undefined;

        return {
            ...p2p_advert_update,
            /** Indicates if this is block trade advert or not. */
            is_block_trade: Boolean(p2p_advert_update.block_trade),
            /** The activation status of the advert. */
            is_active: Boolean(p2p_advert_update.is_active),
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(p2p_advert_update.is_visible),
            /** Indicates that the advert has been deleted. */
            is_deleted: Boolean(p2p_advert_update.deleted),
        };
    }, [data?.p2p_advert_update]);

    return {
        data: modified_data,
        mutate,
        ...rest,
    };
};

export default useAdvertDelete;
