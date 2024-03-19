import React from 'react';
import { useOrderDetails } from '@/pages/orders/screens/OrderDetails/OrderDetailsProvider';
import { Text, useDevice } from '@deriv-com/ui';
import { ActiveOrderInfo } from './ActiveOrderInfo';

const OrderDetailsCardInfo = () => {
    const orderDetails = useOrderDetails();
    const {
        account_currency: accountCurrency,
        advertiser_details: { name },
        amount_display: amountDisplay,
        displayPaymentAmount,
        labels,
        local_currency: localCurrency,
        otherUserDetails,
        purchaseTime,
        rateAmount,
    } = orderDetails;
    const { isMobile } = useDevice();

    const clientDetails = [
        { text: labels.counterpartyNicknameLabel, value: name },
        {
            text: labels.counterpartyRealNameLabel,
            value: `${otherUserDetails.first_name} ${otherUserDetails.last_name}`,
        },
        { text: labels.leftSendOrReceive, value: `${displayPaymentAmount} ${localCurrency}` },
        { text: labels.rightSendOrReceive, value: `${amountDisplay} ${accountCurrency}` },
        { text: `Rate (1 ${accountCurrency})`, value: `${rateAmount} ${localCurrency}` },
        { text: 'Time', value: purchaseTime },
    ];

    return (
        <div className='flex flex-col'>
            <div className='grid grid-cols-2 grid-rows-3 gap-y-6 p-[1.6rem]'>
                {clientDetails.map(detail => (
                    <div className='flex flex-col' key={detail.text}>
                        <Text color='less-prominent' size={isMobile ? 'sm' : 'xs'} weight='500'>
                            {detail.text}
                        </Text>
                        <Text size={isMobile ? 'md' : 'sm'}>{detail.value}</Text>
                    </div>
                ))}
            </div>
            <ActiveOrderInfo />
        </div>
    );
};

export default OrderDetailsCardInfo;
