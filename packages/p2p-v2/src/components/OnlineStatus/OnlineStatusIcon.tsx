import React from 'react';
import clsx from 'clsx';

type TOnlineStatusIconProps = {
    isOnline: boolean;
    size?: number | string;
};

const OnlineStatusIcon = ({ isOnline, size = '1em' }: TOnlineStatusIconProps) => {
    return (
        <div
            className={clsx('p2p-v2-online-status__icon', {
                'p2p-v2-online-status__icon--offline': !isOnline,
                'p2p-v2-online-status__icon--online': !!isOnline,
            })}
            data-testid='dt_p2p_v2_online_status_icon'
            style={{
                height: size,
                width: size,
            }}
        />
    );
};

export default OnlineStatusIcon;
