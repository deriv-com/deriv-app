import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import ExtendedOrderDetails from 'Utils/orders';
import { OnlineStatusAvatar, OnlineStatusLabel } from 'Components/online-status';

const ChatHeaderBody = observer(() => {
    const { order_store, sendbird_store } = useStores();
    const { other_user_details } = order_store.order_information;

    const { is_online, last_online_time } = order_store.online_status;

    React.useEffect(() => {
        order_store.registerOnlineStatusInterval();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <div className='order-chat__header-icon'>
                <OnlineStatusAvatar is_online={is_online} nickname={other_user_details.name} text_size='xs' size={40} />
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
                <OnlineStatusLabel
                    is_online={is_online}
                    last_online_time={last_online_time}
                    size={isMobile() ? 'xxs' : 'xs'}
                />
                {sendbird_store.last_other_user_activity && (
                    <Text
                        as='p'
                        className='order-chat__header-user-timestamp'
                        color='less-prominent'
                        line_height='m'
                        size={isMobile() ? 'xxs' : 'xs'}
                    >
                        {sendbird_store.last_other_user_activity}
                    </Text>
                )}
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
