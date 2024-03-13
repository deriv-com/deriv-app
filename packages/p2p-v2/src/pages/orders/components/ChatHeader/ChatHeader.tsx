import React from 'react';
import { OnlineStatusLabel, UserAvatar } from '@/components';
import { Text, useDevice } from '@deriv-com/ui';
import './ChatHeader.scss';

type TChatHeaderProps = {
    isOnline: 0 | 1;
    lastOnlineTime: number;
    nickname: string;
};
const ChatHeader = ({ isOnline, lastOnlineTime, nickname }: TChatHeaderProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-chat-header flex items-center gap-[1.6rem]'>
            <UserAvatar isOnline nickname={nickname} showOnlineStatus size={40} />
            <div className='flex flex-col'>
                <Text size={isMobile ? 'lg' : 'md'} weight='bold'>
                    {nickname}
                </Text>
                <OnlineStatusLabel isOnline={isOnline} lastOnlineTime={lastOnlineTime} />
            </div>
        </div>
    );
};

export default ChatHeader;
