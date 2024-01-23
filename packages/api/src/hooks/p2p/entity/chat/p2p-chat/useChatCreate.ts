import { useCallback } from 'react';
import useMutation from '../../../../../useMutation';
import useInvalidateQuery from '../../../../../useInvalidateQuery';

type TPayload = NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_chat_create'>>['mutate']>>[0]['payload'];

/**
 * A custom hook to create a p2p chat for the specified order.
 *
 * @example
 * const { data, mutate } = useChatCreate();
 * mutate({ order_id: 'order_id' });
 * **/
const useChatCreate = () => {
    const invalidate = useInvalidateQuery();
    const {
        data,
        mutate: _mutate,
        ...rest
    } = useMutation('p2p_chat_create', {
        onSuccess: () => {
            invalidate('p2p_order_info');
        },
    });
    const mutate = useCallback((payload: TPayload) => _mutate({ payload }), [_mutate]);

    return {
        /** An object containing the chat channel_url and order_id **/
        data: data?.p2p_chat_create,
        /** Function to create a p2p chat for the specified order **/
        mutate,
        ...rest,
    };
};

export default useChatCreate;
