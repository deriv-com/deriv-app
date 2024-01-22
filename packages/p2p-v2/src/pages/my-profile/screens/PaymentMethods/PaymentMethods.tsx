import React from 'react';
import { useAdvertiserPaymentMethodsConfig } from '../../../../providers';
import { PaymentMethodForm } from './PaymentMethodForm';
import { PaymentMethodsList } from './PaymentMethodsList';

const PaymentMethods = () => {
    const { formState } = useAdvertiserPaymentMethodsConfig();
    if (formState?.isVisible) {
        return <PaymentMethodForm configFormState={formState} />;
    }

    return <PaymentMethodsList configFormState={formState} />;
};

export default PaymentMethods;
