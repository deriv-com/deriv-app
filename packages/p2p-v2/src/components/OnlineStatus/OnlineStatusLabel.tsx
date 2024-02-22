import React from 'react';
import { getLastOnlineLabel } from '@/utils';
import { Text } from '@deriv-com/ui';

type TOnlineStatusLabelProps = {
    isOnline: 0 | 1;
    lastOnlineTime: number;
};

const OnlineStatusLabel = ({ isOnline, lastOnlineTime }: TOnlineStatusLabelProps) => {
    return (
        <Text color='less-prominent' size='sm'>
            {getLastOnlineLabel(isOnline, lastOnlineTime)}
        </Text>
    );
};

export default OnlineStatusLabel;
