import React from 'react';
import classNames from 'classnames';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

interface TBotNotificationMessagesProps {
    is_drawer_open: boolean;
    Notifications: React.ComponentType;
}

const BotNotificationMessages = ({ is_drawer_open, Notifications }: TBotNotificationMessagesProps) => (
    <div
        className={classNames('notifications-container', {
            'notifications-container--is-panel-open': is_drawer_open,
        })}
    >
        {' '}
        <></>
        <Notifications />
    </div>
);

export default connect(({ core, run_panel }: RootStore) => ({
    is_drawer_open: run_panel.is_drawer_open,
    Notifications: core.ui.notification_messages_ui,
}))(BotNotificationMessages);
