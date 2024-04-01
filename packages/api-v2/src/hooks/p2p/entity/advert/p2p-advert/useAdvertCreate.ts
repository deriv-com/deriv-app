import { useCallback, useMemo } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'p2p_advert_create'>>['mutate']>[0]['payload'];

/** A custom hook that creates a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To create an advert, specify the following payload arguments in the `mutate` call (some arguments are optional):
 * @example
 *  mutate({
        description: 'Please transfer to account number 1234',
        type: 'buy',
        amount: 100,
        max_order_amount: 50,
        min_order_amount: 20,
        payment_method: 'bank_transfer',
        rate: 4.25,
    });
 * 
*/
const useAdvertCreate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_advert_create', {
        onSuccess: () => {
            invalidate('p2p_advert_list');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    const modified_data = useMemo(() => {
        if (!data?.p2p_advert_create) return undefined;

        return {
            ...data?.p2p_advert_create,
            /** Indicates if this is block trade advert or not. */
            block_trade: Boolean(data?.p2p_advert_create?.block_trade),
            /** The advert creation time in epoch. */
            created_time: data?.p2p_advert_create?.created_time
                ? new Date(data?.p2p_advert_create?.created_time)
                : undefined,
            /** The activation status of the advert. */
            is_active: Boolean(data?.p2p_advert_create?.is_active),
            /** Indicates that this advert will appear on the main advert list. */
            is_visible: Boolean(data?.p2p_advert_create?.is_visible),
        };
    }, [data?.p2p_advert_create]);

    return {
        data: modified_data,
        mutate,
        ...rest,
    };
};

export default useAdvertCreate;
