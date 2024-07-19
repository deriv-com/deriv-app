import React from 'react';
import { Dropdown } from '@deriv-com/ui';
import { usePaymentAgentContext } from '../../provider';
import styles from './PaymentAgentMethodsDropdown.module.scss';

const PaymentAgentMethodsDropdown = () => {
    const { onSelectPaymentMethodHandler, selectedPaymentMethod, supportedPaymentMethods } = usePaymentAgentContext();

    const supportedPaymentMethodsList = [
        { text: 'All payment methods', value: '0' },
        ...supportedPaymentMethods.map(paymentMethod => ({ text: paymentMethod, value: paymentMethod })),
    ];

    return (
        <div className={styles.container}>
            <Dropdown
                isFullWidth
                list={supportedPaymentMethodsList}
                listHeight='sm'
                name='payment_methods'
                onSelect={onSelectPaymentMethodHandler}
                value={selectedPaymentMethod}
                variant='comboBox'
            />
        </div>
    );
};

export default PaymentAgentMethodsDropdown;
