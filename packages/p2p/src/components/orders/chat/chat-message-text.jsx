import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';

const ChatMessageText = React.memo(({ children, color }) => (
    <div className={`order-chat__messages-item-message`}>
        <Text as='div' color={color} line_height='m' size='xs'>
            {children}
        </Text>
    </div>
));

ChatMessageText.displayName = 'ChatMessageText';
ChatMessageText.propTypes = {
    children: PropTypes.any,
    color: PropTypes.string,
};

export default ChatMessageText;
