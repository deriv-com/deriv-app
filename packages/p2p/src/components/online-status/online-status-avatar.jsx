import React from 'react';
import { Text } from '@deriv/components';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import OnlineStatusIcon from './online-status-icon';
import './online-status.scss';

const OnlineStatusAvatar = ({ is_online, nickname, size, text_size }) => {
    return (
        <div className='online-status__avatar'>
            <Text className='online-status__avatar-text' color='colored-background' line_height='m' size={text_size}>
                {getShortNickname(nickname)}
            </Text>

            <OnlineStatusIcon is_online={is_online} size='26%' />
            <svg viewBox={`0 0 ${size * 2} ${size * 2}`} width={size} height={size}>
                <mask id='circle'>
                    <circle fill='white' cx={size} cy={size} r={size} />
                    <circle fill='black' cx='86%' cy='86%' r={size * 0.37} />
                </mask>
                <rect
                    fill={generateHexColourFromNickname(nickname)}
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

OnlineStatusAvatar.propTypes = {
    is_online: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired,
    nickname: PropTypes.string.isRequired,
    size: PropTypes.number,
    text_size: PropTypes.string.isRequired,
};

export default observer(OnlineStatusAvatar);
