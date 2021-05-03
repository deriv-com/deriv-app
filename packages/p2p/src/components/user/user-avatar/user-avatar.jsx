import classNames from 'classnames';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';

const UserAvatar = React.memo(({ className, nickname, size, text_size }) => {
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
UserAvatar.propTypes = {
    className: PropTypes.string,
    nickname: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    text_size: PropTypes.string.isRequired,
};

export default UserAvatar;
