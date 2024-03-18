import React from 'react';
import { Dropdown } from '@deriv-com/ui';
import ChevronIcon from '../../../../assets/images/chevron-icon.svg';
import styles from './PaymentAgentMethodsDropdown.module.scss';

const PaymentAgentMethodsDropdown = () => {
    const supportedPaymentMethodsList = [{ text: 'All payment methods', value: '0' }];

    return (
        <div className={styles.container}>
            <Dropdown
                dropdownIcon={<ChevronIcon />}
                isFullWidth
                list={supportedPaymentMethodsList}
                listHeight='sm'
                name='payment_methods'
                onSelect={() => undefined}
                value={'0'}
                variant='comboBox'
            />
        </div>
    );
};

export default PaymentAgentMethodsDropdown;
