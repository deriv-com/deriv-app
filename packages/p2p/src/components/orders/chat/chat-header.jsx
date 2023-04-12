import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { OnlineStatusAvatar } from 'Components/online-status';
import ExtendedOrderDetails from 'Utils/orders';
import { getLastOnlineLabel } from 'Utils/adverts';

const ChatHeaderBody = observer(() => {
    const { order_store } = useStores();
    const { other_user_details } = order_store.order_information;

    return (
        <React.Fragment>
            <div className='order-chat__header-icon'>
                <OnlineStatusAvatar
                    is_online={other_user_details.is_online}
                    nickname={other_user_details.name}
                    size={40}
                    text_size='s'
                />
            </div>
            <div className='order-chat__header-user'>
                <Text
                    as='p'
                    className='order-chat__header-user-name'
                    color='prominent'
                    line_height='m'
                    size='s'
                    weight='bold'
                >
                    {other_user_details.name}
                </Text>
                <Text
                    as='p'
                    className='order-chat__header-user-timestamp'
                    color='less-prominent'
                    line_height='m'
                    size={isMobile() ? 'xxs' : 'xs'}
                >
                    {getLastOnlineLabel(other_user_details.is_online, other_user_details.last_online_time)}
                </Text>
            </div>
        </React.Fragment>
    );
});

const ChatHeader = () => {
    if (isMobile()) {
        return null; // Handled in chat-wrapper.jsx
    }

    return (
        <div className='order-chat__header'>
            <ChatHeaderBody />
        </div>
    );
};

ChatHeader.Body = ChatHeaderBody;
ChatHeader.displayName = 'ChatHeader';
ChatHeader.propTypes = {
    order_information: PropTypes.instanceOf(ExtendedOrderDetails),
    last_other_user_activity: PropTypes.string,
    setShouldShowChatModal: PropTypes.func,
};

export default ChatHeader;
