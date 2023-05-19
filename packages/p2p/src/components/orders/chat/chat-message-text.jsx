import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import './chat-message-text.scss';

const ChatMessageText = React.memo(({ children, colour }) => (
    <div className='chat-message-text'>
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
