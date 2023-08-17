import React from 'react';
import { Text } from '@deriv/components';
import PaymentMethodIcon from 'Components/payment-method-icon';
import classNames from 'classnames';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const { display_name, type } = payment_method;

    return (
        <div className='order-details-card__accordion-row'>
            <PaymentMethodIcon
                className={classNames({
                    'order-details-card__accordion-icon': type !== 'ewallet',
                })}
                display_name={display_name}
            />
            <div
                className={classNames({
                    'order-details-card__accordion-title': type !== 'ewallet',
                    'order-details-card__accordion-column': type === 'ewallet',
                })}
            >
                <Text color='prominent' size='xs'>
                    {display_name}
                </Text>
                {display_name === 'bank_transfer' && (
                    <Text color='prominent' size='xs' weight='lighter'>
                        {payment_method.fields.bank_name.value}
                    </Text>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodAccordionHeader;
