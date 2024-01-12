import { useCallback } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TOrderCancelPayload = NonNullable<
    Parameters<ReturnType<typeof useMutation<'p2p_order_cancel'>>['mutate']>
>[0]['payload'];

/** A custom hook that cancels a P2P order.
 *
 * To cancel an order, specify the following payload arguments in the `mutate` call:
 * @example
 *  mutate({
 *      id: "1234",
    });
 *
*/
const useOrderCancel = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_order_cancel', {
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });

    const mutate = useCallback((payload: TOrderCancelPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** An object that contains the id and status of the order */
        data: data?.p2p_order_cancel,
        /** A function that cancels a specific order */
        mutate,
        ...rest,
    };
};

export default useOrderCancel;
