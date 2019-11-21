import classNames    from 'classnames';
import React         from 'react';
import { PropTypes } from 'prop-types';
import { connect }   from '../stores/connect';
import                    '../assets/sass/notification-messages.scss';

const NotificationMessages = ({
    is_drawer_open,
    Notifications,
    notifications_length,
}) => (
    <React.Fragment>
        {
            (notifications_length > 0) &&
            <div className={classNames('notifications-container', {
                'notifications-container--is-panel-open': is_drawer_open,
            })}
            >
                <Notifications />
            </div>
        }
    </React.Fragment>
);

NotificationMessages.propTypes = {
    is_drawer_open      : PropTypes.bool,
    Notifications       : PropTypes.node,
    notifications_length: PropTypes.number,
};

export default connect(({ core, run_panel }) => ({
    is_drawer_open      : run_panel.is_drawer_open,
    Notifications       : core.ui.notification_messages_ui,
    notifications_length: core.ui.notification_messages.length,
}))(NotificationMessages);
