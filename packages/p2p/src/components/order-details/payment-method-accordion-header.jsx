import React from 'react';
import { Icon, Text } from '@deriv/components';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const method = payment_method.display_name.replace(/\s|-/gm, '');

    return (
        <div className='order-details-card__accordion-row'>
            <Icon icon={`IcCashier${method}`} size={16} />
            <div className='order-details-card__accordion-column'>
                <Text color='prominent' size='xs'>
                    {payment_method.display_name}
                </Text>
            </div>
        </div>
    );
};

export default PaymentMethodAccordionHeader;
