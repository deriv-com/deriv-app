import { useCallback, useMemo } from 'react';
import { useFetch, useInvalidateQuery, useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

type TPayloads = NonNullable<
    NonNullable<Parameters<ReturnType<typeof useRequest<'p2p_advertiser_payment_methods'>>['mutate']>[0]>['payload']
>;
type TCreatePayload = NonNullable<TPayloads['create']>[0];
type TUpdatePayload = NonNullable<TPayloads['update']>[0];

const type_to_icon_mapper = {
    bank: 'IcCashierBankTransfer',
    other: 'IcCashierOther',
    ewallet: 'IcCashierEwallet',
};

/** A custom hook to fetch, create, update, and delete p2p advertiser payment methods */
const useP2PAdvertiserPaymentMethods = () => {
    const invalidate = useInvalidateQuery();
    const { client } = useStore();
    const { is_authorize } = client;
    const { mutate, ...mutate_rest } = useRequest('p2p_advertiser_payment_methods', {
        onSuccess: () => invalidate('p2p_advertiser_payment_methods'),
    });
    const { data, ...rest } = useFetch('p2p_advertiser_payment_methods', {
        options: { enabled: is_authorize },
    });

    // Modify the response to add additional informations
    const modified_data = useMemo(() => {
        const p2p_advertiser_payment_methods = data?.p2p_advertiser_payment_methods;

        if (!p2p_advertiser_payment_methods) return undefined;

        return Object.keys(p2p_advertiser_payment_methods).map(key => {
            const advertiser_payment_method = p2p_advertiser_payment_methods[key];

            return {
                ...advertiser_payment_method,
                /** Icon for each payment method based on the type */
                icon: type_to_icon_mapper[advertiser_payment_method.type],
                /** The id of payment method */
                id: key,
            };
        });
    }, [data]);

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
        ...rest,
        mutation: mutate_rest,
    };
};

export default useP2PAdvertiserPaymentMethods;
