import React from 'react';
import { Icon, Text } from '@deriv/components';
import './payment-method-accordion-header.scss';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const method = payment_method.display_name.replace(/\s|-/gm, '');

    if (method === 'BankTransfer' || method === 'Other') {
        return (
            <div className='payment-method-accordion-header__row'>
                <Icon className='payment-method-accordion-header__icon' icon={`IcCashier${method}`} size={16} />
                <div className='payment-method-accordion-header__title'>
                    <Text color='prominent' size='xs'>
                        {payment_method.display_name}
                    </Text>
                    {method === 'BankTransfer' && (
                        <Text color='prominent' size='xs' weight='lighter'>
                            {payment_method.fields.bank_name.value}
                        </Text>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='payment-method-accordion-header__row'>
            <Icon icon='IcCashierEwallet' size={16} />
            <div className='payment-method-accordion-header__column'>
                <Text color='prominent' size='xs'>
                    {payment_method.display_name}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodAccordionHeader;
