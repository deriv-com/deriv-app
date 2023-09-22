import React from 'react';
import { Text } from '@deriv/components';
import PaymentMethodIcon from 'Components/payment-method-icon';
import classNames from 'classnames';
import './payment-method-accordion-header.scss';

const PaymentMethodAccordionHeader = ({ payment_method }) => {
    const { display_name, type } = payment_method;

    return (
        <div className='payment-method-accordion-header__row'>
            <PaymentMethodIcon
                className={classNames({
                    'payment-method-accordion-header__icon': type !== 'ewallet',
                })}
                display_name={display_name}
            />
            <div
                className={classNames({
                    'payment-method-accordion-header__title': type !== 'ewallet',
                    'payment-method-accordion-header__column': type === 'ewallet',
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
