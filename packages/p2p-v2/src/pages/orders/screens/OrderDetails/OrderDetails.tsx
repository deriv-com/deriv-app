import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { useExtendedOrderDetails } from '@/hooks';
import { OrderDetailsProvider } from '@/providers/OrderDetailsProvider';
import { p2p, useActiveAccount, useServerTime } from '@deriv/api-v2';
import { Button, InlineMessage, Loader, Text, useDevice } from '@deriv-com/ui';
import ChatIcon from '../../../../public/ic-chat.svg';
import { OrderDetailsCard } from '../../components/OrderDetailsCard';
import { OrderDetailsCardFooter } from '../../components/OrderDetailsCard/OrderDetailsCardFooter';
import { OrdersChatSection } from '../OrdersChatSection';
import './OrderDetails.scss';

type TOrderDetailsProps = {
    orderId: string;
};

const OrderDetails = ({ orderId }: TOrderDetailsProps) => {
    const history = useHistory();
    const location = useLocation();
    const showChatParam = new URLSearchParams(location.search).get('showChat');
    const [showChat, setShowChat] = useState(!!showChatParam);

    const { data: orderInfo, failureReason, isError: isErrorOrderInfo, isLoading } = p2p.order.useGet(orderId);
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
    const warningMessage = 'Don’t risk your funds with cash transactions. Use bank transfers or e-wallets instead.';

    const onReturn = () => history.goBack();
    const onChatReturn = () => {
        setShowChat(false);
        if (showChatParam) onReturn();
    };

    if (isLoading) return <Loader isFullScreen />;

    // TODO: replace with proper error screen once design is ready
    if (isErrorOrderInfo) return <Text>{failureReason?.error.message}</Text>;

    if (isMobile) {
        return (
            <OrderDetailsProvider value={{ isErrorOrderInfo, orderDetails }}>
                {showChat ? (
                    <OrdersChatSection
                        id={orderId}
                        isInactive={!!orderDetails?.isInactiveOrder}
                        onReturn={onChatReturn}
                        otherUserDetails={orderDetails?.otherUserDetails}
                    />
                ) : (
                    <FullPageMobileWrapper
                        className='p2p-v2-order-details'
                        onBack={onReturn}
                        renderFooter={() => <OrderDetailsCardFooter />}
                        renderHeader={() => (
                            <Text as='div' className='w-full flex items-center justify-between' size='lg' weight='bold'>
                                {headerText}
                                <Button
                                    className='h-full p-0'
                                    color='white'
                                    data-testid='dt_p2p_v2_order_details_chat_button'
                                    onClick={() => setShowChat(true)}
                                    variant='contained'
                                >
                                    <ChatIcon className='mt-2' />
                                </Button>
                            </Text>
                        )}
                    >
                        {shouldShowLostFundsBanner && (
                            <InlineMessage
                                className='w-fit mx-[1.6rem] mt-[1.6rem]'
                                iconPosition='top'
                                variant='warning'
                            >
                                <Text size='xs'>{warningMessage}</Text>
                            </InlineMessage>
                        )}
                        <OrderDetailsCard />
                    </FullPageMobileWrapper>
                )}
            </OrderDetailsProvider>
        );
    }

    return (
        <OrderDetailsProvider value={{ isErrorOrderInfo, orderDetails }}>
            <div className='w-full'>
                <PageReturn onClick={onReturn} pageTitle={headerText} weight='bold' />
                <div className='p2p-v2-order-details'>
                    {shouldShowLostFundsBanner && (
                        <InlineMessage className='w-fit mb-6' variant='warning'>
                            <Text size='2xs'>{warningMessage}</Text>
                        </InlineMessage>
                    )}
                    <div className='grid grid-cols-none lg:grid-cols-2 lg:gap-14'>
                        <OrderDetailsCard />
                        <OrdersChatSection
                            id={orderId}
                            isInactive={!!orderDetails?.isInactiveOrder}
                            otherUserDetails={orderDetails?.otherUserDetails}
                        />
                    </div>
                </div>
            </div>
        </OrderDetailsProvider>
    );
};

export default OrderDetails;
