import { useMemo } from 'react';
import useAuthorize from '../useAuthorize';
import { PAYMENT_METHOD_ICONS } from '../../constants';
import useQuery from '../../useQuery';

/** A custom hook that returns a list of P2P available payment methods **/
const useP2PPaymentMethods = () => {
    const { isSuccess } = useAuthorize();
    const { data, ...rest } = useQuery('p2p_payment_methods', { options: { enabled: isSuccess } });
    // Modify the data to add additional information.
    const modified_data = useMemo(() => {
        const p2p_payment_methods = data?.p2p_payment_methods;

        if (!p2p_payment_methods) return undefined;

        return Object.keys(p2p_payment_methods).map(key => {
            const payment_method = p2p_payment_methods[key];
            const fields = Object.keys(payment_method.fields).map(field_key => payment_method.fields[field_key]);

            return {
                ...payment_method,
                /** Payment method field definitions. */
                fields,
                /** Icon for each payment method based on the type */
                icon: PAYMENT_METHOD_ICONS[payment_method.type],
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

export default useP2PPaymentMethods;
