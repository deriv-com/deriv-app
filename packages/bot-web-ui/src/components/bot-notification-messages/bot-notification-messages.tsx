import classNames from 'classnames';
import React from 'react';
import { connect } from 'Stores/connect';

type BotNotificationMessagesProps = {
    is_drawer_open: boolean;
    notifications_length: number;
};

const BotNotificationMessages = ({ is_drawer_open, Notifications }: BotNotificationMessagesProps) => (
    <div
        className={classNames('notifications-container', {
            'notifications-container--is-panel-open': is_drawer_open,
        })}
    >
        <Notifications />
    </div>
);

export default connect(({ core, run_panel }) => ({
    is_drawer_open: run_panel.is_drawer_open,
    Notifications: core.ui.notification_messages_ui,
}))(BotNotificationMessages);
