import React, { Fragment } from 'react';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { Divider, Text, useDevice } from '@deriv-com/ui';
import { PaymentMethodAccordion } from '../PaymentMethodAccordion';

const ActiveOrderInfo = () => {
    const orderDetails = useOrderDetails();
    const {
        advert_details: { description },
        contact_info: contactInfo,
        isActiveOrder,
        labels,
        payment_info: paymentInfo,
        payment_method_details: paymentMethodDetails,
    } = orderDetails;
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';

    const adDetails = [
        { text: labels.contactDetails, value: contactInfo || '-' },
        { text: labels.instructions, value: description || '-' },
    ];

    if (isActiveOrder)
        return (
            <>
                <Divider color='#f2f3f4' />
                <PaymentMethodAccordion
                    paymentDetails={labels.paymentDetails}
                    paymentInfo={paymentInfo}
                    paymentMethodDetails={paymentMethodDetails}
                />
                <Divider color='#f2f3f4' />
                {adDetails.map((detail, key) => (
                    <Fragment key={detail.text}>
                        <div className='flex flex-col p-[1.6rem] gap-2'>
                            <Text size={textSize} weight='bold'>
                                {detail.text}
                            </Text>
                            <Text size={textSize}>{detail.value}</Text>
                        </div>
                        {key === 0 && <Divider color='#f2f3f4' />}
                    </Fragment>
                ))}
            </>
        );

    return null;
};

export default ActiveOrderInfo;
