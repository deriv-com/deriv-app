import classNames from 'classnames';
import { Text } from '@deriv/components';
import React from 'react';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';

type UserAvatarProps = {
    className: string,
    nickname: string,
    size: number,
    text_size: string
};

const UserAvatar = React.memo(({
    className,
    nickname,
    size,
    text_size
}: UserAvatarProps) => {
    return (
        <div
            className={classNames('dp2p-avatar', className)}
            style={{
                backgroundColor: generateHexColourFromNickname(nickname),
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
