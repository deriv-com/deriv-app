import React, { memo, PropsWithChildren } from 'react';
import { Text } from '@deriv-com/ui';
import './ChatMessageText.scss';

type TChatMessageTextProps = {
    color: string;
    type?: string;
};

const ChatMessageText = ({ children, color, type = '' }: PropsWithChildren<TChatMessageTextProps>) => (
    <div className='p2p-v2-chat-message-text'>
        <Text color={color} size={type === 'admin' ? 'xs' : 'sm'}>
            {children}
        </Text>
    </div>
);

export default memo(ChatMessageText);
