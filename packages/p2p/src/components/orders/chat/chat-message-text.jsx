import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';

const ChatMessageText = React.memo(({ children, colour }) => (
    <div className={`order-chat__messages-item-message`}>
        <Text as='p' color={colour} line_height='m' size='xs'>
            {children}
        </Text>
    </div>
));

ChatMessageText.displayName = 'ChatMessageText';
ChatMessageText.propTypes = {
    children: PropTypes.any,
    colour: PropTypes.string,
};

export default ChatMessageText;
