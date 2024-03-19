import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { TOrders } from 'types';
import { BASE_URL, ORDERS_STATUS } from '@/constants';
import { useExtendedOrderDetails, useQueryString } from '@/hooks';
import { OrderRatingButton, OrderStatusTag, OrderTimer } from '@/pages/orders/components';
import { getDistanceToServerTime } from '@/utils';
import { useActiveAccount, useServerTime } from '@deriv/api-v2';
import { Button, Text, useDevice } from '@deriv-com/ui';
import ChatIcon from '../../../../../public/ic-chat.svg';
import './OrdersTableRow.scss';

const OrdersTableRow = ({ ...props }: TOrders[number]) => {
    const { isMobile } = useDevice();
    const { queryString } = useQueryString();
    const history = useHistory();
    const isPast = queryString.tab === ORDERS_STATUS.PAST_ORDERS;
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
        isCompletedOrder,
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
                            <Button
                                className='h-full p-0'
                                color='white'
                                onClick={() => history.push(`${BASE_URL}/orders?order=${id}`)}
                                variant='contained'
                            >
                                <ChatIcon />
                            </Button>
                        </div>
                    )}
                    {isCompletedOrder && <OrderRatingButton />}
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
        <div
            className={clsx('p2p-v2-orders-table-row cursor-pointer', { 'p2p-v2-orders-table-row--inactive': isPast })}
            onClick={() => history.push(`${BASE_URL}/orders?order=${id}`)}
        >
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
            {isCompletedOrder && <OrderRatingButton />}
        </div>
    );
};

export default OrdersTableRow;
