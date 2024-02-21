import React from 'react';
import { useFetch } from '@deriv/api';
import { useStore } from '@deriv/stores';

const type_to_icon_mapper = {
    bank: 'IcCashierBankTransfer',
    other: 'IcCashierOther',
    ewallet: 'IcCashierEwallet',
};

/**
 * @deprecated This hook is deprecated. Please use the one from the `api` package instead.
 * A custom hook that return the list of P2P available payment methods */
const useP2PPaymentMethods = () => {
    const { client } = useStore();
    const { is_authorize } = client;

    const { data, ...rest } = useFetch('p2p_payment_methods', {
        options: { enabled: is_authorize, refetchOnWindowFocus: false },
    });

    // Modify the data to add additional information.
    const modified_data = React.useMemo(() => {
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
                icon: type_to_icon_mapper[payment_method.type],
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
