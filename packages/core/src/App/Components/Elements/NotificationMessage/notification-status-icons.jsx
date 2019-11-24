import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import Icon           from 'Assets/icon.jsx';
import IconDanger     from 'Assets/Common/icon-danger.jsx';
import { icon_types } from './constants';

const NotificationStatusIcons = ({ type, class_suffix }) => {
    // we cannot lazyload danger icon for notification message as its also meant for offline status notification
    // if danger icon is not lazyloaded and user loses internet connection, it will crash with missing chunk error
    if (type && type === 'danger') {
        return (
            <IconDanger className={classNames('inline-icon', 'notification__icon-type', {
                [`notification__icon-type--${class_suffix}`]: class_suffix,
            })}
            />
        );
    }
    return (
        <React.Fragment>
            { !!type &&
                <Icon
                    icon={icon_types[type]}
                    className={classNames('notification__icon-type', {
                        [`notification__icon-type--${class_suffix}`]: class_suffix,
                    })}
                />
            }
        </React.Fragment>
    );
};

NotificationStatusIcons.propTypes = {
    class_suffix: PropTypes.string,
    type        : PropTypes.string,
};

export default NotificationStatusIcons;
