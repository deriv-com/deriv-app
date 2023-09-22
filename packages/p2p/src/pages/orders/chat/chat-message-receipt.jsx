import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@deriv/components';
import ChatMessage from 'Utils/chat-message';
import './chat-message-receipt.scss';

const ChatMessageReceipt = ({ chat_channel, message, sendbird_user_id }) => {
    let icon_name;

    if (message.status === ChatMessage.STATUS_PENDING) {
        icon_name = 'IcMessagePending';
    } else if (message.status === ChatMessage.STATUS_ERRORED) {
        icon_name = 'IcMessageErrored';
    } else {
        const channel_user_ids = Object.keys(chat_channel.cachedUnreadMemberState);
        const other_sendbird_user_id = channel_user_ids.find(user_id => user_id !== sendbird_user_id);
        // User's last read timestamp is larger than or equal to this message's createdAt.
        if (chat_channel.cachedUnreadMemberState[other_sendbird_user_id] >= message.created_at) {
            icon_name = 'IcMessageSeen';
        } else {
            icon_name = 'IcMessageDelivered';
        }
    }

    return <Icon className='chat-message-receipt' icon={icon_name} size={16} />;
};

ChatMessageReceipt.propTypes = {
    chat_channel: PropTypes.object,
    message: PropTypes.instanceOf(ChatMessage),
    sendbird_user_id: PropTypes.string,
};

export default ChatMessageReceipt;
