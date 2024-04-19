import { useMemo } from 'react';
import { useGetAccountStatus } from '@deriv/api-v2';
import { getPaymentMethodsConfig } from 'src/constants';
import { TPaymentMethod, TPaymentMethodIdentifier, TPaymentMethodInfo } from 'src/types';

export const usePaymentMethodDetails = () => {
    const { data: accountStatus, ...rest } = useGetAccountStatus();

    const ownership = accountStatus?.authentication?.ownership;
    const ownershipStatus = ownership?.status?.toLowerCase();

    const paymentMethodData = useMemo(() => {
        const groups: Partial<Record<TPaymentMethod, TPaymentMethodInfo>> = {};
        const paymentMethodConfig = getPaymentMethodsConfig();
        ownership?.requests?.forEach(request => {
            const paymentMethod = request?.payment_method?.toLowerCase() as TPaymentMethod;
            const paymentMethodDetails = paymentMethodConfig[paymentMethod] ?? paymentMethodConfig.other;

            if (groups[paymentMethod]) {
                groups[paymentMethod]?.items?.push(request);
            } else {
                groups[paymentMethod] = {
                    documentsRequired: request?.documents_required,
                    icon: paymentMethodDetails?.icon?.light,
                    identifier: paymentMethodDetails.identifier as TPaymentMethodIdentifier,
                    inputLabel: paymentMethodDetails.inputLabel,
                    instructions: paymentMethodDetails.instructions,
                    isGenericPM: !paymentMethodDetails.inputLabel,
                    items: [request],
                    paymentMethod,
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
