import React from 'react';
import { Text } from '@deriv/components';
import './payment-method-accordion-content.scss';

const PaymentMethodAccordionContent = ({ payment_method }) => {
    return (
        <React.Fragment>
            {Object.entries(payment_method?.fields).map(field => {
                return (
                    <div
                        key={`${field[1].display_name}${field[1].value}`}
                        className='payment-method-accordion-content--field'
                    >
                        <Text color='less-prominent' size='xxs'>
                            {field[1].display_name}
                        </Text>
                        <Text color='prominent' size='xs'>
                            {field[1].value}
                        </Text>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

export default PaymentMethodAccordionContent;
