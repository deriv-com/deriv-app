import React, { ComponentType, SVGAttributes } from 'react';
import { CHAT_MESSAGE_STATUS } from '@/constants';
import { useSendbird } from '@/hooks';
import MessageDeliveredIcon from '../../../../public/ic-message-delivered.svg';
import MessageErroredIcon from '../../../../public/ic-message-errored.svg';
import MessagePendingIcon from '../../../../public/ic-message-pending.svg';
import MessageSeenIcon from '../../../../public/ic-message-seen.svg';

type TChatMessageReceiptProps = {
    chatChannel: NonNullable<ReturnType<typeof useSendbird>['activeChatChannel']>;
    message: ReturnType<typeof useSendbird>['messages'][number];
    userId: string;
};

const ChatMessageReceipt = ({ chatChannel, message, userId }: TChatMessageReceiptProps) => {
    let Icon: ComponentType<SVGAttributes<SVGElement>>;

    if (message.status === CHAT_MESSAGE_STATUS.PENDING) {
        Icon = MessagePendingIcon;
    } else if (message.status === CHAT_MESSAGE_STATUS.ERRORED) {
        Icon = MessageErroredIcon;
    } else {
        const channelUserIds = Object.keys(chatChannel.cachedUnreadMemberState);
        const otherSendbirdUserId = channelUserIds.find(id => id !== userId);
        // User's last read timestamp is larger than or equal to this message's createdAt.
        if (chatChannel.cachedUnreadMemberState[otherSendbirdUserId] >= message.createdAt) {
            Icon = MessageSeenIcon;
        } else {
            Icon = MessageDeliveredIcon;
        }
    }

    return <Icon data-testid='dt_p2p_v2_chat_message_receipt_icon' />;
};

export default ChatMessageReceipt;
