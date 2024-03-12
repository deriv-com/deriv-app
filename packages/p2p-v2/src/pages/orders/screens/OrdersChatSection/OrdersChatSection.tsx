import React from 'react';
import { useHistory } from 'react-router-dom';
import { FullPageMobileWrapper } from '@/components';
import { useSendbird } from '@/hooks';
import { Divider, Loader, useDevice } from '@deriv-com/ui';
import { ChatFooter } from '../../components/ChatFooter';
import { ChatHeader } from '../../components/ChatHeader';
import { ChatMessages } from '../../components/ChatMessages';
import './OrdersChatSection.scss';

//TODO: remove dummy values and specify property type after implementation of order details page and endpoint implementation.
const otherUserDetails = {
    id: '66',
    isInactive: 0,
    isOnline: 1 as 0 | 1,
    lastOnlineTime: 1709810646,
    name: 'client CR90000343',
};

// type TOrdersChatSectionProps = {
//     otherUserDeatils: object;
// };

const OrdersChatSection = () => {
    const { isMobile } = useDevice();
    const history = useHistory();
    const { id, isOnline, lastOnlineTime, name } = otherUserDetails;
    const { activeChatChannel, isChatLoading, messages, userId } = useSendbird(id);

    if (isChatLoading) {
        return <Loader isFullScreen={false} />;
    }

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='p2p-v2-orders-chat-section__full-page'
                //TODO: handle goback based on route
                onBack={() => history.goBack()}
                renderFooter={() => (
                    <ChatFooter isClosed={!!otherUserDetails.isInactive || !!activeChatChannel?.isFrozen} />
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
        <div>
            {isChatLoading ? (
                <Loader isFullScreen={false} />
            ) : (
                <>
                    <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />
                    <Divider color='#f2f3f4' />
                    <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                    <Divider color='#f2f3f4' />
                    <ChatFooter isClosed={!!otherUserDetails.isInactive || !!activeChatChannel?.isFrozen} />
                </>
            )}
        </div>
    );
};

export default OrdersChatSection;
