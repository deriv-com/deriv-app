import React from 'react';
import clsx from 'clsx';

type TOnlineStatusIconProps = {
    isOnline: boolean;
    isRelative?: boolean;
    size?: number | string;
};

const OnlineStatusIcon = ({ isOnline, isRelative = false, size = '1em' }: TOnlineStatusIconProps) => {
    return (
        <div
            className={clsx('p2p-v2-online-status__icon', {
                'p2p-v2-online-status__icon--offline': !isOnline,
                'p2p-v2-online-status__icon--online': !!isOnline,
                relative: isRelative,
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
