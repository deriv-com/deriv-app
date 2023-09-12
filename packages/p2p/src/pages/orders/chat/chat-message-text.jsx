import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import './chat-message-text.scss';

const ChatMessageText = React.memo(({ children, color }) => (
    <div className={'chat-message-text'}>
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
