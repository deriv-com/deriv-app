import classNames     from 'classnames';
import PropTypes      from 'prop-types';
import React          from 'react';
import Icon           from 'Assets/icon.jsx';
import { icon_types } from './constants';

const NotificationStatusIcons = ({ type, class_suffix }) => (
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

NotificationStatusIcons.propTypes = {
    class_suffix: PropTypes.string,
    type        : PropTypes.string,
};

export default NotificationStatusIcons;
