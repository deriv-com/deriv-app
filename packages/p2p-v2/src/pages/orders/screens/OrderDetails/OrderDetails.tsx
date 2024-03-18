import React from 'react';
import { useHistory } from 'react-router-dom';
import { PageReturn } from '@/components';
import { BASE_URL } from '@/constants';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p, useActiveAccount, useServerTime } from '@deriv/api-v2';
import { InlineMessage, Loader, Text } from '@deriv-com/ui';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';

type TOrderDetailsProps = {
    orderId: string;
};

const OrderDetails = ({ orderId }: TOrderDetailsProps) => {
    const history = useHistory();
    const { data: orderInfo, isLoading } = p2p.order.useGet(orderId);
    const { data: activeAccount } = useActiveAccount();
    const { data: serverTime } = useServerTime();
    const { data: orderDetails } = useExtendedOrderDetails({
        loginId: activeAccount?.loginid,
        orderDetails: orderInfo,
        serverTime,
    });
    const { isBuyOrderForUser, shouldShowLostFundsBanner } = orderDetails;

    if (isLoading) return <Loader isFullScreen />;

    return (
        <div className='w-full'>
            <PageReturn
                onClick={() => history.push(`${BASE_URL}/orders`)}
                pageTitle={`${isBuyOrderForUser ? 'Buy' : 'Sell'} USD order`}
                weight='bold'
            />
            {shouldShowLostFundsBanner && (
                <InlineMessage className='w-fit mb-6' variant='warning'>
                    <Text size='2xs'>
                        Don’t risk your funds with cash transactions. Use bank transfers or e-wallets
                    </Text>
                </InlineMessage>
            )}
            <OrderDetailsCard orderDetails={orderDetails} />
        </div>
    );
};

export default OrderDetails;
