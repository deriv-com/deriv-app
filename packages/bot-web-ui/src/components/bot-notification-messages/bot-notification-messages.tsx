import React from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { DBOT_TABS } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';

const { BOT_BUILDER, CHART } = DBOT_TABS;

const BotNotificationMessages = observer(() => {
    const { ui } = useStore();
    const { run_panel, dashboard } = useDBotStore();

    const { is_drawer_open } = run_panel;
    const Notifications = ui.notification_messages_ui;
    const { active_tab, is_info_panel_visible } = dashboard;

    return (
        <div
            className={classNames('notifications-container', {
                'notifications-container__dashboard': active_tab === 0 && is_info_panel_visible,
                'notifications-container--panel-open': [BOT_BUILDER, CHART].includes(active_tab) && is_drawer_open,
            })}
            data-testid='dt_notifications_container'
        >
            <Notifications />
        </div>
    );
});

export default BotNotificationMessages;
