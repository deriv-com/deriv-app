import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { generateHexColourFromNickname, getShortNickname } from '../../../utils/string';

const UserAvatar = React.memo(({ nickname, size, text_size }) => {
    return (
        <div
            className='dp2p-avatar'
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
    nickname: PropTypes.string.isRequired,
    size: PropTypes.number,
    text_size: PropTypes.string,
};

export default UserAvatar;
