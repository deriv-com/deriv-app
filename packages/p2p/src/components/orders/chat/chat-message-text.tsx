import React from 'react';
import { Text } from '@deriv/components';

type ChatMessageTextProps = {
    children: React.ReactNode,
    colour: string
};

const ChatMessageText = React.memo(({
    children,
    colour
}: ChatMessageTextProps) => (
    <div className={`order-chat__messages-item-message`}>
        <Text as='p' color={colour} line_height='m' size='xs'>
            {children}
        </Text>
    </div>
));

ChatMessageText.displayName = 'ChatMessageText';

export default ChatMessageText;
