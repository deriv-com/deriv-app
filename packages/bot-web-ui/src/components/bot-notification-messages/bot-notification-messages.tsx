import React from 'react';
import classNames from 'classnames';
import { DBOT_TABS } from 'Constants/bot-contents';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';

interface TBotNotificationMessagesProps {
    is_drawer_open: boolean;
    active_tab: number;
    is_info_panel_visible: boolean;
    Notifications: React.ComponentType;
}

const { BOT_BUILDER, CHART } = DBOT_TABS;

const BotNotificationMessages = ({
    is_drawer_open,
    Notifications,
    is_info_panel_visible,
    active_tab,
}: TBotNotificationMessagesProps) => (
    <div
        className={classNames('notifications-container', {
            'notifications-container__dashboard': active_tab === 0 && is_info_panel_visible,
            'notifications-container--panel-open': [BOT_BUILDER, CHART].includes(active_tab) && is_drawer_open,
        })}
    >
        <Notifications />
    </div>
);

export default connect(({ core, run_panel, dashboard }: RootStore) => ({
    is_drawer_open: run_panel.is_drawer_open,
    Notifications: core.ui.notification_messages_ui,
    active_tab: dashboard.active_tab,
    is_info_panel_visible: dashboard.is_info_panel_visible,
}))(BotNotificationMessages);
