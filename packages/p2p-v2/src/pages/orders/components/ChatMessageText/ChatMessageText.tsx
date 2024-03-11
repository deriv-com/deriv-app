import React, { memo, PropsWithChildren } from 'react';
import { Text, useDevice } from '@deriv-com/ui';
import './ChatMessageText.scss';

type TChatMessageTextProps = {
    color: string;
    type?: string;
};

const ChatMessageText = ({ children, color, type = '' }: PropsWithChildren<TChatMessageTextProps>) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-chat-message-text'>
            <Text color={color} lineHeight='xl' size={type === 'admin' && !isMobile ? 'xs' : 'sm'}>
                {children}
            </Text>
        </div>
    );
};

export default memo(ChatMessageText);
