import React from 'react';
import { useSendbird } from '@/hooks';
import { Divider, Loader } from '@deriv-com/ui';
import { ChatFooter } from '../ChatFooter';
import { ChatHeader } from '../ChatHeader';
import { ChatMessages } from '../ChatMessages';
import './OrdersChatSection.scss';

const otherUserDetails = {
    isOnline: 1 as 0 | 1,
    lastOnlineTime: 1709810646,
    name: 'client CR90000313',
};
const OrdersChatSection = () => {
    const { activeChatChannel, isChatLoading, messages, userId } = useSendbird('32');
    const { isOnline, lastOnlineTime, name } = otherUserDetails;

    if (isChatLoading) {
        return <Loader isFullScreen={false} />;
    }
    return (
        <div>
            <div>
                <ChatHeader isOnline={isOnline} lastOnlineTime={lastOnlineTime} nickname={name} />
                <Divider color='#f2f3f4' />
                <ChatMessages chatChannel={activeChatChannel} chatMessages={messages} userId={userId} />
                <ChatFooter />
            </div>
        </div>
    );
};

export default OrdersChatSection;
