import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

type TOnlineStatusIconProps = {
    is_online: number | boolean;
    size?: string | number;
};

const OnlineStatusIcon = ({ is_online, size = '1em' }: TOnlineStatusIconProps) => {
    return (
        <div
            data-testid='dt_online_status_icon'
            className={classNames('online-status__icon', {
                'online-status__icon--offline': !is_online,
                'online-status__icon--online': !!is_online,
            })}
            style={{
                width: size,
                height: size,
            }}
        />
    );
};

export default observer(OnlineStatusIcon);
