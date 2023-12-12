import { useCallback, useMemo } from 'react';
import useInvalidateQuery from '../../useInvalidateQuery';
import useAuthorize from '../useAuthorize';
import useQuery from '../../useQuery';
import useMutation from '../../useMutation';

type TPayloads = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useMutation<'p2p_advertiser_payment_methods'>>['mutate']>[0]>['payload']
>;
type TCreatePayload = NonNullable<TPayloads['create']>[0];
type TUpdatePayload = NonNullable<TPayloads['update']>[0];

const type_to_icon_mapper = {
    bank: 'IcCashierBankTransfer',
    other: 'IcCashierOther',
    ewallet: 'IcCashierEwallet',
};

/** A custom hook to fetch, create, update and delete p2p advertiser payment methods. */
const useP2PAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_advertiser_payment_methods', { options: { enabled: isSuccess } });
    const { mutate, ...mutate_rest } = useMutation('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });

    // Modify the response to add additional information
    const modified_data = useMemo(() => {
        const payment_methods = data?.p2p_advertiser_payment_methods;

        if (!payment_methods) return undefined;

        return Object.keys(payment_methods).map(key => {
            const payment_method = payment_methods[key];

            return {
                ...payment_method,
                /** The id of payment method */
                id: key,
                /** Icon for each payment method based on the type */
                icon: type_to_icon_mapper[payment_method.type],
            };
        });
    }, [data?.p2p_advertiser_payment_methods]);

    const create = useCallback((values: TCreatePayload) => mutate({ payload: { create: [{ ...values }] } }), [mutate]);

    const update = useCallback(
        (id: string, values: TUpdatePayload) => mutate({ payload: { update: { [id]: { ...values } } } }),
        [mutate]
    );

    const delete_payment_method = useCallback((id: number) => mutate({ payload: { delete: [id] } }), [mutate]);

    return {
        /** The list of p2p advertiser payment methods */
        data: modified_data,
        /** Sends a request to create new p2p advertiser payment method */
        create,
        /** Sends a request to update existing p2p advertiser payment method */
        update,
        /** Sends a request to delete existing p2p advertiser payment method */
        delete: delete_payment_method,
        mutation: mutate_rest,
        ...rest,
    };
};

export default useP2PAdvertiserPaymentMethods;
