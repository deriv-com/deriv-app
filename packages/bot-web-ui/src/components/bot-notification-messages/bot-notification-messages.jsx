import classNames from 'classnames';
import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'Stores/connect';

const BotNotificationMessages = ({ is_drawer_open, Notifications }) => (
    <div
        className={classNames('notifications-container', {
            'notifications-container--is-panel-open': is_drawer_open,
        })}
    >
        <Notifications />
    </div>
);

BotNotificationMessages.propTypes = {
    is_drawer_open: PropTypes.bool,
    // Notifications       : PropTypes.node,
    notifications_length: PropTypes.number,
};

export default connect(({ core, run_panel }) => ({
    is_drawer_open: run_panel.is_drawer_open,
    Notifications: core.ui.notification_messages_ui,
}))(BotNotificationMessages);
