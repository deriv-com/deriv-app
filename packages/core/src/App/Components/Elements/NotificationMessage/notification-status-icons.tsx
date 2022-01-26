import classNames from 'classnames';
import React from 'react';
import { Icon } from '@deriv/components';
import { icon_types } from './constants';

type NotificationStatusIconsProps = {
    class_suffix: string;
    type: string;
};

const NotificationStatusIcons = ({ type, class_suffix }: NotificationStatusIconsProps) => {
    // we cannot lazyload danger icon for notification message as its also meant for offline status notification
    // if danger icon is not lazyloaded and user loses internet connection, it will crash with missing chunk error
    if (type && type === 'danger') {
        return (
            <Icon
                icon='IcAlertDanger'
                className={classNames('inline-icon', 'notification__icon-type', {
                    [`notification__icon-type--${class_suffix}`]: class_suffix,
                })}
            />
        );
    }
    return (
        <React.Fragment>
            {!!type && (
                <Icon
                    icon={icon_types[type]}
                    className={classNames('notification__icon-type', {
                        [`notification__icon-type--${class_suffix}`]: class_suffix,
                    })}
                    color={type === 'success' ? 'green' : undefined}
                />
            )}
        </React.Fragment>
    );
};

export default NotificationStatusIcons;
