import React from 'react';
import { OnlineStatusLabel, UserAvatar } from '@/components';
import { Text } from '@deriv-com/ui';
import './ChatHeader.scss';

type TChatHeaderProps = {
    isOnline: 0 | 1;
    lastOnlineTime: number;
    nickname: string;
};
const ChatHeader = ({ isOnline = 1, lastOnlineTime = 123143, nickname = 'asdf' }: TChatHeaderProps) => {
    return (
        <div>
            <div className='flex px-[2.4rem] py-[1.6rem] gap-[1.6rem] items-center'>
                <UserAvatar isOnline nickname={nickname} showOnlineStatus size={40} />
                <div className='flex flex-col'>
                    <Text weight='bold'>{nickname}</Text>
                    <OnlineStatusLabel isOnline={isOnline} lastOnlineTime={lastOnlineTime} />
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
