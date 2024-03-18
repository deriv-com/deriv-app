import React from 'react';
import { ExtendedOrderDetails } from '@/hooks/useExtendedOrderDetails';
import { Divider, Text } from '@deriv-com/ui';
import { PaymentMethodAccordion } from '../PaymentMethodAccordion';

type TActiveOrderInfoProps = {
    orderDetails: ExtendedOrderDetails;
};

const ActiveOrderInfo = ({ orderDetails }: TActiveOrderInfoProps) => {
    const {
        advert_details: { description },
        contact_info: contactInfo,
        isActiveOrder,
        labels,
        payment_info: paymentInfo,
        payment_method_details: paymentMethodDetails,
    } = orderDetails;

    const adDetails = [
        { text: labels.paymentDetails, value: contactInfo },
        { text: labels.instructions, value: description },
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
                    <>
                        <div className='flex flex-col p-[1.6rem] gap-2' key={detail.text}>
                            <Text size='sm' weight='bold'>
                                {detail.text}
                            </Text>
                            <Text size='sm'>{detail.value}</Text>
                        </div>
                        {key === 0 && <Divider color='#f2f3f4' />}
                    </>
                ))}
            </>
        );

    return null;
};

export default ActiveOrderInfo;
