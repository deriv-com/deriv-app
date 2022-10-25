import React from 'react';
import { Icon, Text } from '@deriv/components';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const method = payment_method.display_name.replace(/\s|-/gm, '');

    if (method === 'BankTransfer' || method === 'Other') {
        return (
            <div className='order-details-card__accordion-row'>
                <Icon className='order-details-card__accordion-icon' icon={`IcCashier${method}`} size={16} />
                <div className='order-details-card__accordion-title'>
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
        <div className='order-details-card__accordion-row'>
            <Icon icon='IcCashierEwallet' size={16} />
            <div className='order-details-card__accordion-column'>
                <Text color='prominent' size='xs'>
                    {payment_method.display_name}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodAccordionHeader;
