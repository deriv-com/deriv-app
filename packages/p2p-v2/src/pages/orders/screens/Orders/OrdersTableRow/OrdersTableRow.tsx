import React from 'react';
import clsx from 'clsx';
import { TOrders } from 'types';
import { ORDERS_STATUS } from '@/constants';
import { useExtendedOrderDetails, useQueryString } from '@/hooks';
import { OrderStatusTag, OrderTimer } from '@/pages/orders/components';
import { getDistanceToServerTime } from '@/utils';
import { useActiveAccount, useServerTime } from '@deriv/api-v2';
import { Text, useDevice } from '@deriv-com/ui';
import ChatIcon from '../../../../../public/ic-chat.svg';
import './OrdersTableRow.scss';

const OrdersTableRow = ({ ...props }: TOrders[number]) => {
    const { isMobile } = useDevice();
    const { queryString } = useQueryString();
    const isPast = queryString.get('tab') === ORDERS_STATUS.PAST_ORDERS;
    const { data: activeAccount } = useActiveAccount();
    const { data: serverTime } = useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: props,
        serverTime,
    });

    const distance = getDistanceToServerTime(orderDetails.orderExpiryMilliseconds, serverTime?.server_time_moment);

    const {
        account_currency: accountCurrency,
        amount_display: amountDisplay,
        id,
        local_currency: localCurrency,
        price_display: priceDisplay,
        purchaseTime,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightDisabled,
        shouldHighlightSuccess,
        statusString,
    } = orderDetails;
    const isBuyOrderForUser = orderDetails.isBuyOrderForUser;
    const transactionAmount = `${Number(priceDisplay).toFixed(2)} ${localCurrency}`;
    const offerAmount = `${amountDisplay} ${accountCurrency}`;

    if (isMobile) {
        return (
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    <Text size='sm' weight='bold'>
                        <OrderStatusTag
                            shouldHighlightAlert={shouldHighlightAlert}
                            shouldHighlightDanger={shouldHighlightDanger}
                            shouldHighlightDisabled={shouldHighlightDisabled}
                            shouldHighlightSuccess={shouldHighlightSuccess}
                            status={statusString}
                        />
                    </Text>
                    {!isPast && (
                        <div className='flex items-center gap-5'>
                            <OrderTimer distance={distance} />
                            <ChatIcon />
                        </div>
                    )}
                </div>
                <div className='flex gap-1'>
                    <Text size='2xl' weight='bold'>
                        {`${isBuyOrderForUser ? 'Buy' : 'Sell'} ${offerAmount}`}
                    </Text>
                </div>
                <Text color='less-prominent' size='sm'>
                    {purchaseTime}
                </Text>
            </div>
        );
    }

    return (
        <div className={clsx('p2p-v2-orders-table-row', { 'p2p-v2-orders-table-row--inactive': isPast })}>
            {isPast && <Text size='sm'>{purchaseTime}</Text>}
            <Text size='sm'>{isBuyOrderForUser ? 'Buy' : 'Sell'}</Text>
            <Text size='sm'>{id}</Text>
            <Text size='sm'>{orderDetails.otherUserDetails.name}</Text>
            <Text size='sm' weight='bold'>
                <OrderStatusTag
                    shouldHighlightAlert={shouldHighlightAlert}
                    shouldHighlightDanger={shouldHighlightDanger}
                    shouldHighlightDisabled={shouldHighlightDisabled}
                    shouldHighlightSuccess={shouldHighlightSuccess}
                    status={statusString}
                />
            </Text>
            <Text size='sm'>{isBuyOrderForUser ? transactionAmount : offerAmount}</Text>
            <Text size='sm'>{isBuyOrderForUser ? offerAmount : transactionAmount}</Text>
            {!isPast && <OrderTimer distance={distance} />}
        </div>
    );
};

export default OrdersTableRow;
