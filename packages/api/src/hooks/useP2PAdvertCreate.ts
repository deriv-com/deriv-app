import { useCallback } from 'react';
import useMutation from '../useMutation';
// import useInvalidateQuery from '../useInvalidateQuery';

type TPayload = Parameters<ReturnType<typeof useMutation<'p2p_advert_create'>>['mutate']>[0]['payload'];

/** A custom hook that creates a P2P advert. This can only be used by an approved P2P advertiser.
 * 
 * To create an advert, specify the following payload arguments in the `mutate` call:
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
const useP2PAdvertCreate = () => {
    // const invalidate = useInvalidateQuery();
    const { mutate: _mutate, ...rest } = useMutation('p2p_advert_create', {
        onSuccess: () => {
            // TODO: Invalidate P2P advert list hook once the hook is implemented
            // invalidate('p2p_advert_list');
        },
    });

    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        mutate,
        ...rest,
    };
};

export default useP2PAdvertCreate;
