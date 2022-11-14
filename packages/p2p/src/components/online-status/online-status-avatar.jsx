import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import OnlineStatusIcon from './online-status-icon';
import './online-status.scss';
import classNames from 'classnames';

const OnlineStatusAvatar = ({ is_online, nickname, large, medium, small, text_size }) => {
    return (
        <div
            className={classNames('online-status__avatar', {
                'online-status__avatar--large': large,
                'online-status__avatar--medium': medium,
                'online-status__avatar--small': small,
            })}
        >
            <div
                className='online-status__avatar-image'
                style={{
                    backgroundColor: generateHexColourFromNickname(nickname),
                }}
            >
                <Text color='colored-background' line_height='x' size={text_size}>
                    {getShortNickname(nickname)}
                </Text>
            </div>
            <OnlineStatusIcon is_online={is_online} />
        </div>
    );
};

OnlineStatusAvatar.propTypes = {
    className: PropTypes.string,
    nickname: PropTypes.string.isRequired,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    small: PropTypes.bool,
    text_size: PropTypes.string.isRequired,
};

export default observer(OnlineStatusAvatar);
