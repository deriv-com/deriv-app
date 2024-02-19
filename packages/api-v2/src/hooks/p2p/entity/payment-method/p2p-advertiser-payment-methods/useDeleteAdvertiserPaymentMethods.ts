import { useCallback } from 'react';
import useInvalidateQuery from '../../../../../useInvalidateQuery';
import useMutation from '../../../../../useMutation';

/** A custom hook that sends a request to delete an existing p2p advertiser payment method. */
const useDeleteAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const deletePaymentMethod = useCallback((id: number) => mutate({ payload: { delete: [id] } }), [mutate]);

    return {
        data,
        /** Sends a request to delete an existing p2p advertiser payment method */
        delete: deletePaymentMethod,
        ...rest,
    };
};

export default useDeleteAdvertiserPaymentMethods;
