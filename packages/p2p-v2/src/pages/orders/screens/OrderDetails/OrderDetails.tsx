import React from 'react';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { BASE_URL } from '@/constants';
import { useExtendedOrderDetails } from '@/hooks';
import { p2p, useActiveAccount, useServerTime } from '@deriv/api-v2';
import { InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';
import { OrderDetailsCardFooter } from '../../components/OrderDetailsCard/OrderDetailsCardFooter';
import './OrderDetails.scss';

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
    const { isMobile } = useDevice();
    const headerText = `${isBuyOrderForUser ? 'Buy' : 'Sell'} USD order`;
    const onReturn = () => history.push(`${BASE_URL}/orders`);
    const warningMessage = 'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.';

    if (isLoading) return <Loader isFullScreen />;

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-order-details'
                onBack={onReturn}
                renderFooter={() => <OrderDetailsCardFooter orderDetails={orderDetails} />}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        {headerText}
                    </Text>
                )}
            >
                {shouldShowLostFundsBanner && (
                    <InlineMessage className='w-fit mx-[1.6rem] mt-[1.6rem]' iconPosition='top' variant='warning'>
                        <Text size='xs'>{warningMessage}</Text>
                    </InlineMessage>
                )}
                <OrderDetailsCard orderDetails={orderDetails} />
            </FullPageMobileWrapper>
        );
    }

    return (
        <div className='w-full'>
            <PageReturn onClick={onReturn} pageTitle={headerText} weight='bold' />
            {shouldShowLostFundsBanner && (
                <InlineMessage className='w-fit mb-6' variant='warning'>
                    <Text size='2xs'>{warningMessage}</Text>
                </InlineMessage>
            )}
            <OrderDetailsCard orderDetails={orderDetails} />
        </div>
    );
};

export default OrderDetails;
