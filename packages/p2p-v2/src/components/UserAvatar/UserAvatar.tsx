import React, { memo } from 'react';
import clsx from 'clsx';
import { Text } from '@deriv-com/ui';
import { getShortNickname, TGenericSizes } from '../../utils';
import './UserAvatar.scss';

type TUserAvatarProps = {
    className?: string;
    nickname: string;
    size?: number;
    textSize?: TGenericSizes;
};

const UserAvatar = memo(({ className, nickname, size = 32, textSize = 'md' }: TUserAvatarProps) => {
    return (
        <div
            className={clsx('p2p-v2-user-avatar', className)}
            data-testid='p2p_v2_user_avatar'
            style={{
                height: `${size}px`,
                width: `${size}px`,
            }}
        >
            <Text className='p2p-v2-user-avatar__short-nickname' lineHeight='sm' size={textSize}>
                {getShortNickname(nickname)}
            </Text>
        </div>
    );
});

UserAvatar.displayName = 'UserAvatar';
export default UserAvatar;
