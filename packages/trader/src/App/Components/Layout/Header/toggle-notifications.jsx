import React         from 'react';
import Notifications from 'App/Containers/Notifications/notifications.jsx';
import Icon          from 'Assets/icon.jsx';
import                    'Sass/app/modules/notifications.scss';

const ToggleNotificationsDrawer = ({ is_visible, toggleDialog }) =>  (
    <div className='notifications-toggle'>
        <div
            className='notifications-toggle__icon-container'
            onClick={toggleDialog}
            style={{ cursor: is_visible ? 'default' : 'pointer' }}
        >
            <Icon
                className='notifications-toggle__icon'
                icon='IconBell'
            />
        </div>
        <Notifications
            toggleDialog={toggleDialog}
        />
    </div>
);

export default ToggleNotificationsDrawer;
