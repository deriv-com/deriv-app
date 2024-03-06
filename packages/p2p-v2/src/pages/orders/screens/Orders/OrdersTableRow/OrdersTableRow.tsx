/* eslint-disable camelcase */
import React from 'react';
import useExtendedOrderDetails from '@/hooks/useExtendedOrderDetails';
import { OrderStatusTag } from '@/pages/orders/components';
import { useActiveAccount, useServerTime } from '@deriv/api-v2';
import { Text } from '@deriv-com/ui';
import './OrdersTableRow.scss';

const OrdersTableRow = ({ ...props }) => {
    const { data: activeAccount } = useActiveAccount();
    const { data: serverTime } = useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: props,
        serverTime,
    });

    const {
        account_currency,
        amount_display,
        id,
        local_currency,
        price_display,
        shouldHighlightAlert,
        shouldHighlightDanger,
        shouldHighlightDisabled,
        shouldHighlightSuccess,
        statusString,
    } = orderDetails;
    const isBuyOrderForUser = orderDetails.isBuyOrderForUser;
    const transactionAmount = `${Number(price_display).toFixed(2)} ${local_currency}`;
    const offerAmount = `${amount_display}${account_currency}`;

    return (
        <div className='p2p-v2-orders-table-row'>
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
            <Text size='sm'>{new Date().toLocaleString()}</Text>
        </div>
    );
};

export default OrdersTableRow;
