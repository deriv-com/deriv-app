import React from 'react';
import { PaymentMethodForm } from '../../../../components/PaymentMethodForm';
import { useAdvertiserPaymentMethodsConfig } from '../../../../providers';
import { PaymentMethodsList } from './PaymentMethodsList';

/**
 * @component This component is the main component of the PaymentMethods screen. It's used to conditionally display the list of payment methods and the form to add a new payment method
 * @returns {JSX.Element}
 * @example <PaymentMethods />
 * **/
const PaymentMethods = () => {
    const { formState } = useAdvertiserPaymentMethodsConfig();
    if (formState?.isVisible) {
        return <PaymentMethodForm configFormState={formState} />;
    }

    return <PaymentMethodsList configFormState={formState} />;
};

export default PaymentMethods;
