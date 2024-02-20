import React from 'react';
import { getLastOnlineLabel } from '@/utils';
import { Text, useDevice } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    isOnline: 0 | 1;
    lastOnlineTime: number;
};

const OnlineStatusLabel = ({ isOnline, lastOnlineTime }: TOnlineStatusLabelProps) => {
    const { isMobile } = useDevice();
    const size = isMobile ? 'xs' : 'sm';

    return (
        <Text color='less-prominent' size={size}>
            {getLastOnlineLabel(isOnline, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
