import React from 'react';
import { Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { getLastOnlineLabel } from 'Utils/adverts';
import { useDevice } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    is_online: 0 | 1;
    last_online_time: number;
    size?: string;
};

const OnlineStatusLabel = ({ is_online, last_online_time, size }: TOnlineStatusLabelProps) => {
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'xxxs' : 'xs';
    return (
        <Text color='less-prominent' size={size ?? textSize}>
            {getLastOnlineLabel(is_online, last_online_time)}
        </Text>
    );
};

export default observer(OnlineStatusLabel);
