import { useMemo } from 'react';
import useAuthorize from '../../../../useAuthorize';
import useQuery from '../../../../../useQuery';

/** A custom hook that returns the list of P2P Advertiser Payment Methods */
const useAdvertiserPaymentMethods = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_advertiser_payment_methods', { options: { enabled: isSuccess } });

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
            };
        });
    }, [data?.p2p_advertiser_payment_methods]);

    return {
        /** The list of P2P Advertiser Payment Methods */
        data: modified_data,
        ...rest,
    };
};

export default useAdvertiserPaymentMethods;
