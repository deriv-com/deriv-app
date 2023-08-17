import { useCallback, useMemo } from 'react';
import { useFetch, useInvalidateQuery, useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';

const type_to_icon_mapper = {
    bank: 'IcCashierBankTransfer',
    other: 'IcCashierOther',
    ewallet: 'IcCashierEwallet',
};

/** A custom hook to fetch, create, update, and delete p2p advertiser payment methods */
const useP2PAdvertiserPaymentMethods = (handleMutationError?: (error?: unknown) => void) => {
    const invalidate = useInvalidateQuery();
    const { client } = useStore();
    const { is_authorize } = client;

    /** Make a request to p2p_advertiser_payment_methods from API and onSuccess it will invalidate the cached data  */
    const { mutate } = useRequest('p2p_advertiser_payment_methods', {
        onSuccess: () => {
            invalidate('p2p_advertiser_payment_methods');
        },
        onError: error => {
            if (error && handleMutationError) handleMutationError(error);
        },
    });

    /** Fetch p2p_advertiser_payment_methods from API  */
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
                /** The ID of payment method */
                ID: key,
            };
        });
    }, [data]);

    const create = useCallback(
        (values: { method: string; [k: string]: string }) => mutate({ payload: { create: [{ ...values }] } }),
        [mutate]
    );

    const update = useCallback(
        (id: string, values: { [k: string]: string }) => mutate({ payload: { update: { [id]: { ...values } } } }),
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
        delete_payment_method,
        /** The rest of useFetch payloads */
        ...rest,
    };
};

export default useP2PAdvertiserPaymentMethods;
