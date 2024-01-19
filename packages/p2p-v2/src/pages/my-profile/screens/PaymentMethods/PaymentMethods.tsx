import React from 'react';
import { useAdvertiserPaymentMethodsConfig } from '../../../../components/AdvertiserPaymentMethodsProvider';
import { PaymentMethodForm } from './PaymentMethodForm';
import { PaymentMethodsList } from './PaymentMethodsList';

const PaymentMethods = () => {
    const { formState } = useAdvertiserPaymentMethodsConfig();

    if (formState?.isVisible) {
        return <PaymentMethodForm configFormSate={formState} />;
    }

    return <PaymentMethodsList configFormSate={formState} />;
};

export default PaymentMethods;
