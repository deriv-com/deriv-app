import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

const OnlineStatusIcon = ({ is_online }) => {
    return (
        <div
            className={classNames('online-status__icon', {
                'online-status__icon--offline': is_online === 0,
                'online-status__icon--online': is_online === 1,
            })}
        />
    );
};

export default observer(OnlineStatusIcon);
