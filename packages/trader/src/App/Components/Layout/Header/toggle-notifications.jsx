import React             from 'react';
import Notifications     from 'App/Containers/Notifications/notifications.jsx';
import Icon              from 'Assets/icon.jsx';
import { ToggleDrawer }  from 'App/Components/Elements/Drawer';

const ToggleNotificationsDrawer = (is_visible, toggleNotifications) => (
    <ToggleDrawer
        alignment='right'
        icon={<Icon icon='IconBell' />}
        icon_class='notify-toggle'
    >
        <Notifications
            toggle={toggleNotifications}
        />
    </ToggleDrawer>
);

export default ToggleNotificationsDrawer;
