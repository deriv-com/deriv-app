import React from 'react';
import { CHAT_MESSAGE_STATUS } from '@/constants';
import { useSendbird } from '@/hooks';
// import { Icon } from '@deriv/components';
import './ChatMessageReceipt.scss';

type TChatMessageReceiptProps = {
    chatChannel: NonNullable<ReturnType<typeof useSendbird>['activeChatChannel']>;
    message: ReturnType<typeof useSendbird>['messages'][number];
    userId: string;
};

const ChatMessageReceipt = ({ chatChannel, message, userId }: TChatMessageReceiptProps) => {
    let icon_name;

    if (message.status === CHAT_MESSAGE_STATUS.PENDING) {
        icon_name = 'IcMessagePending';
    } else if (message.status === CHAT_MESSAGE_STATUS.ERRORED) {
        icon_name = 'IcMessageErrored';
    } else {
        const channelUserIds = Object.keys(chatChannel.cachedUnreadMemberState);
        const otherSendbirdUserId = channelUserIds.find(id => id !== userId);
        // User's last read timestamp is larger than or equal to this message's createdAt.
        if (chatChannel.cachedUnreadMemberState[otherSendbirdUserId as number] >= message.createdAt) {
            icon_name = 'IcMessageSeen';
        } else {
            icon_name = 'IcMessageDelivered';
        }
    }

    return <>Icon</>;
};

export default ChatMessageReceipt;
