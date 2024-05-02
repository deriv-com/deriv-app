import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv/api-v2';
import { getPaymentMethodsConfig } from 'src/constants';
import { TPaymentMethod, TPaymentMethodData, TPaymentMethodIdentifier } from 'src/types';

export const usePaymentMethodDetails = () => {
    const { data: accountStatus, ...rest } = useGetAccountStatus();

    const ownership = accountStatus?.authentication?.ownership;
    const ownershipStatus = ownership?.status?.toLowerCase();

    const paymentMethodData = useMemo(() => {
        const groups = {} as TPaymentMethodData;
        const paymentMethodConfig = getPaymentMethodsConfig();
        ownership?.requests?.forEach(request => {
            const paymentMethod = request?.payment_method?.toLowerCase() as TPaymentMethod;
            const paymentMethodDetails = paymentMethodConfig[paymentMethod] ?? paymentMethodConfig.other;

            if (groups[paymentMethod]) {
                groups[paymentMethod]?.items?.push(request);
            } else {
                groups[paymentMethod] = {
                    documentsRequired: request?.documents_required,
                    identifier: paymentMethodDetails.identifier as TPaymentMethodIdentifier,
                    inputLabel: paymentMethodDetails.inputLabel,
                    isGenericPM: !paymentMethodDetails.inputLabel,
                    items: [request],
                    paymentMethod: request.payment_method as string,
                };
            }
        });
        return groups;
    }, [ownership?.requests]);

    return {
        ownershipStatus,
        paymentMethodData,
        ...rest,
    };
};
