import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import ExtendedOrderDetails from 'Utils/orders';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import './chat-header.scss';

const ChatHeaderBody = observer(() => {
    const { order_store, sendbird_store } = useStores();
    const { other_user_details } = order_store.order_information;
    const icon_background_colour = generateHexColourFromNickname(other_user_details.name);
    const short_nickname = getShortNickname(other_user_details.name);

    return (
        <React.Fragment>
            <div className='chat-header-icon' style={{ backgroundColor: icon_background_colour }}>
                <Text size='xs' color='colored-background' line_height='m'>
                    {short_nickname}
                </Text>
            </div>
            <div className='chat-header-user'>
                <Text as='p' className='chat-header-user-name' color='prominent' line_height='m' size='s' weight='bold'>
                    {other_user_details.name}
                </Text>
                {sendbird_store.last_other_user_activity && (
                    <Text
                        as='p'
                        className='chat-header-user-timestamp'
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
        <div className='chat-header'>
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
