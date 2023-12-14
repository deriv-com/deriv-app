import { useCallback } from 'react';
import useMutation from '../../useMutation';

type TPayload = NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_chat_create'>>['mutate']>>[0]['payload'];

/**
 * A custom hook to create a p2p chat for the specified order.
 *
 * @example
 * const { data, mutate } = useChatCreate();
 * mutate({ order_id: 'order_id' });
 * **/
const useChatCreate = () => {
    const { data, mutate: _mutate, ...rest } = useMutation('p2p_chat_create');
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
