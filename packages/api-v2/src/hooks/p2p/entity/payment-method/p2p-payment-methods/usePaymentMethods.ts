import { useMemo } from 'react';
import useAuthorize from '../../../../useAuthorize';
import useQuery from '../../../../../useQuery';

/** A custom hook that returns a list of P2P available payment methods **/
const usePaymentMethods = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_payment_methods', {
        options: { enabled: isSuccess, refetchOnWindowFocus: false },
    });
    // Modify the data to add additional information.
    const modified_data = useMemo(() => {
        const p2p_payment_methods = data?.p2p_payment_methods;

        if (!p2p_payment_methods) return undefined;

        return Object.keys(p2p_payment_methods).map(key => {
            const payment_method = p2p_payment_methods[key];
            return {
                ...payment_method,
                /** Payment method id */
                id: key,
            };
        });
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default usePaymentMethods;
