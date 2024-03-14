import React from 'react';
import classNames from 'classnames';
import { getShortNickname } from 'Utils/string';
import { Text } from '@deriv/components';

type TUserAvatarProps = {
    className?: string;
    nickname: string;
    size: number;
    text_size: string;
};

const UserAvatar = React.memo(({ className, nickname, size, text_size }: TUserAvatarProps) => {
    return (
        <div
            className={classNames('user-avatar', className)}
            style={{
                height: `${size}px`,
                width: `${size}px`,
            }}
        >
            <Text color='colored-background' line_height='x' size={text_size}>
                {getShortNickname(nickname)}
            </Text>
        </div>
    );
});

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
