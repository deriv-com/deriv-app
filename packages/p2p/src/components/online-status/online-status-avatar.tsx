import React from 'react';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { getShortNickname } from 'Utils/string';
import OnlineStatusIcon from './online-status-icon';

type TOnlineStatusAvatarProps = {
    is_online: number | boolean;
    nickname: string;
    size: number;
    text_size: string;
};

const OnlineStatusAvatar = ({ is_online, nickname, size, text_size }: TOnlineStatusAvatarProps) => {
    return (
        <div className='online-status__avatar'>
            <Text className='online-status__avatar__text' color='colored-background' size={text_size}>
                {getShortNickname(nickname)}
            </Text>

            <OnlineStatusIcon is_online={is_online} size='26%' />
            <svg viewBox={`0 0 ${size * 2} ${size * 2}`} width={size} height={size}>
                <mask id='circle'>
                    <circle fill='white' cx={size} cy={size} r={size} />
                    <circle fill='black' cx='87%' cy='86%' r={size * 0.37} />
                </mask>
                <rect
                    fill='#FF444F'
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    mask='url(#circle)'
                />
            </svg>
        </div>
    );
};

export default observer(OnlineStatusAvatar);
