import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import './payment-method-accordion-content.scss';

const PaymentMethodAccordionContent = ({ advertiser_details, client_details, is_my_ad, payment_method }) => {
    return (
        <React.Fragment>
            <div className='payment-method-accordion-content--field'>
                <Text color='less-prominent' size='xxs'>
                    <Localize i18n_default_text='Name' />
                </Text>
                <Text color='prominent' size='xs'>
                    {is_my_ad
                        ? `${client_details.first_name} ${client_details.last_name}`
                        : `${advertiser_details.first_name} ${advertiser_details.last_name}`}
                </Text>
            </div>
            {Object.entries(payment_method?.fields).map((field, key) => {
                return (
                    <div key={key} className='payment-method-accordion-content--field'>
                        <Text color='less-prominent' size='xxs'>
                            {field[1].display_name}
                        </Text>
                        <Text color='prominent' size='xs'>
                            {field[1].value}
                        </Text>
                    </div>
                );
            })}
            {/* {payment_method?.fields?.map((field, key) => {
                return (
                    <div key={key}>
                        <Text color='less-prominent' size='xxs'>
                            {field?.display_name}
                        </Text>
                        <Text color='prominent' size='xs'>
                            {field?.value}
                        </Text>
                    </div>
                );
            })} */}
        </React.Fragment>
    );
};

export default PaymentMethodAccordionContent;
