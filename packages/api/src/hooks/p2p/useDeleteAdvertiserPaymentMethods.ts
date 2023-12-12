import { useCallback } from 'react';
import useInvalidateQuery from '../../useInvalidateQuery';
import useAuthorize from '../useAuthorize';
import useMutation from '../../useMutation';

/** A custom hook that sends a request to delete an existing p2p advertiser payment method. */
const useDeleteAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { isSuccess } = useAuthorize();
    const { mutate, ...rest } = useMutation('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const delete_payment_method = useCallback(
        (id: number) => {
            if (isSuccess) {
                mutate({ payload: { delete: [id] } });
            }
        },
        [mutate, isSuccess]
    );

    return {
        /** Sends a request to delete an existing p2p advertiser payment method */
        delete: delete_payment_method,
        ...rest,
    };
};

export default useDeleteAdvertiserPaymentMethods;
