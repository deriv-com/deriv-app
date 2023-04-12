import React from 'react';
import { Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { getLastOnlineLabel } from 'Utils/adverts';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';

const OnlineStatusLabel = ({ is_online, last_online_time, size = isMobile() ? 'xxxs' : 'xs' }) => {
    return (
        <Text color='less-prominent' size={size}>
            {getLastOnlineLabel(is_online, last_online_time)}
        </Text>
    );
};

OnlineStatusLabel.propTypes = {
    is_online: PropTypes.number.isRequired,
    last_online_time: PropTypes.number,
    size: PropTypes.string,
};

export default observer(OnlineStatusLabel);
