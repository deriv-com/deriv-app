import classNames    from 'classnames';
import React         from 'react';
import { Popover }   from 'deriv-components';
import Notifications from 'App/Containers/Notifications/notifications.jsx';
import Icon          from 'Assets/icon.jsx';
import                    'Sass/app/modules/notifications.scss';

const ToggleNotificationsDrawer = ({ count, is_visible, toggleDialog, tooltip_message }) =>  (
    <div className={classNames('notifications-toggle', {
        'notifications-toggle--active': is_visible,
    })}
    >
        <Popover
            classNameBubble='notifications-toggle__tooltip'
            alignment='bottom'
            message={tooltip_message}
        >
            <div
                className={classNames('notifications-toggle__icon-wrapper', {
                    'notifications-toggle__icon-wrapper--active': is_visible,
                })}
                onClick={toggleDialog}
            >
                <Icon
                    className='notifications-toggle__icon'
                    icon='IconBell'
                />
                {!!count &&
                <i className='notifications-toggle__step' data-count={count} />
                }
            </div>
        </Popover>
        <Notifications
            is_visible={is_visible}
            toggleDialog={toggleDialog}
        />
    </div>
);

export default ToggleNotificationsDrawer;
