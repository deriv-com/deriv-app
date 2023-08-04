import React from 'react';
import classNames from 'classnames';
import { Icon, Text } from '@deriv/components';
import { getPaymentMethodIcon } from 'Utils/payment-method.js';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const method = payment_method.display_name.replace(/\s|-/gm, '');
    const icon = getPaymentMethodIcon(method);
    return (
        <div className='order-details-card__accordion-row'>
            <Icon
                className={classNames({
                    'order-details-card__accordion-icon': icon !== 'IcCashierEwallet',
                })}
                icon={icon}
                size={16}
            />
            <div
                className={
                    icon === 'IcCashierEwallet'
                        ? 'order-details-card__accordion-column'
                        : 'order-details-card__accordion-title'
                }
            >
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
};

export default PaymentMethodAccordionHeader;
