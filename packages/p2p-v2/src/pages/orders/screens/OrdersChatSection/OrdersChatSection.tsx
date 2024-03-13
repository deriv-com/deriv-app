import React from 'react';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper } from '@/components';
import { useExtendedOrderDetails, useSendbird } from '@/hooks';
import { Divider, Loader, useDevice } from '@deriv-com/ui';
import { ChatError, ChatFooter, ChatHeader, ChatMessages } from '../../components';
import './OrdersChatSection.scss';

type TOrdersChatSectionProps = {
    id: string;
    isInactive: boolean;
    otherUserDetails: ReturnType<typeof useExtendedOrderDetails>['data']['otherUserDetails'];
};

const OrdersChatSection = ({ id, isInactive, otherUserDetails }: TOrdersChatSectionProps) => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { is_online: isOnline, last_online_time: lastOnlineTime, name } = otherUserDetails ?? {};
    const { activeChatChannel, isChatLoading, isError, messages, refreshChat, sendFile, sendMessage, userId } =
        useSendbird(id);

    if (isError) {
        return (
            <div className='p2p-v2-orders-chat-section flex flex-col justify-center items-center h-[70vh]'>
                <ChatError onClickRetry={refreshChat} />
            </div>
        );
    }

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-orders-chat-section__full-page'
                //TODO: handle goback based on route
                onBack={() => history.goBack()}
                renderFooter={() => (
                    <ChatFooter
                        isClosed={isInactive || !!activeChatChannel?.isFrozen}
                        sendFile={sendFile}
                        sendMessage={sendMessage}
                    />
                )}
                renderHeader={() => <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />}
            >
                {isChatLoading ? (
                    <Loader isFullScreen={false} />
                ) : (
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                )}
            </FullPageMobileWrapper>
        );
    }
    return (
        <div className='p2p-v2-orders-chat-section flex flex-col justify-center items-center h-[70vh]'>
            {isChatLoading ? (
                <Loader isFullScreen={false} />
            ) : (
                <>
                    <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />
                    <Divider className='w-full' color='#f2f3f4' />
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                    <Divider className='w-full' color='#f2f3f4' />
                    <ChatFooter
                        isClosed={!!otherUserDetails?.isInactive || !!activeChatChannel?.isFrozen}
                        sendFile={sendFile}
                        sendMessage={sendMessage}
                    />
                </>
            )}
        </div>
    );
};

export default OrdersChatSection;
