import { useCallback, useMemo } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TOrderDisputePayload = NonNullable<
    Parameters<ReturnType<typeof useMutation<'p2p_order_dispute'>>['mutate']>
>[0]['payload'];

/** A custom hook that disputes a P2P order.
 *
 * To dispute an order, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
 *      id: "1234",
        dispute_reason: "seller_not_released",
    });
 *
*/
const useOrderDispute = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_order_dispute', {
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const mutate = useCallback(
        (payload: TOrderDisputePayload) => {
            _mutate({ payload });
        },
        [_mutate]
    );

    const modified_data = useMemo(() => {
        const p2p_order_dispute = data?.p2p_order_dispute;

        if (!p2p_order_dispute) return undefined;

        return {
            ...p2p_order_dispute,
            advert_details: {
                ...p2p_order_dispute.advert_details,
                /** Indicates if this is block trade advert or not. */
                is_block_trade: Boolean(p2p_order_dispute.advert_details.block_trade),
            },
            advertiser_details: {
                ...p2p_order_dispute.advertiser_details,
                /** Indicates if the advertiser is currently online. */
                is_online: Boolean(p2p_order_dispute.advertiser_details.is_online),
            },
            client_details: {
                ...p2p_order_dispute.client_details,
                /** Indicates if the client is currently online. */
                is_online: Boolean(p2p_order_dispute.advertiser_details.is_online),
            },
            /** Indicates if the order is created for the advert of the current client, */
            is_incoming: Boolean(p2p_order_dispute.is_incoming),
            /** Indicates if a review can be given */
            is_reviewable: Boolean(p2p_order_dispute.is_reviewable),
            /** Indicates if the latest order changes have been seen by the current client */
            is_seen: Boolean(p2p_order_dispute.is_seen),
            /** Indicates that the seller in the process of confirming the order. */
            is_verification_pending: Boolean(p2p_order_dispute.verification_pending),
        };
    }, [data]);

    return {
        /** Data returned after disputing an order */
        data: modified_data,
        /** mutate function to dispute an order */
        mutate,
        ...rest,
    };
};

export default useOrderDispute;
