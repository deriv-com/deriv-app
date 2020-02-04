import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import { icon_types } from './constants';

const NotificationStatusIcons = ({ type, class_suffix }) => {
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

NotificationStatusIcons.propTypes = {
    class_suffix: PropTypes.string,
    type: PropTypes.string,
};

export default NotificationStatusIcons;
