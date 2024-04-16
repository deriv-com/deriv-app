import { useCallback } from 'react';
import useInvalidateQuery from '../../../../../useInvalidateQuery';
import useMutation from '../../../../../useMutation';

type TPayloads = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_advertiser_payment_methods'>>['mutate']>[0]>['payload']
>;
type TUpdatePayload = NonNullable<TPayloads['update']>[0];

/** A custom hook that sends a request to update an existing p2p advertiser payment method. */
const useUpdateAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { data, mutate, ...rest } = useMutation('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    const update = useCallback(
        (id: string, values: TUpdatePayload) => mutate({ payload: { update: { [id]: { ...values } } } }),
        [mutate]
    );

    return {
        data,
        /** Sends a request to update an existing p2p advertiser payment method */
        update,
        ...rest,
    };
};

export default useUpdateAdvertiserPaymentMethods;
