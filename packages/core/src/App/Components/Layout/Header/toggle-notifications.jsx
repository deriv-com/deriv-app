import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Counter, DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import NotificationsDialog from 'App/Containers/NotificationsDialog';
import 'Sass/app/modules/notifications-dialog.scss';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';

const ToggleNotificationsDrawer = ({
    count,
    is_visible,
    toggleDialog,
    tooltip_message,
    should_disable_pointer_events = false,
}) => {
    const {
        notifications: { is_notifications_loading_completed },
    } = useStore();

    const [counter, setCounter] = useState(null);

    // don't hide count when 'is_notifications_loading_completed' = false
    useEffect(() => {
        // show count if loading completed and count more than 0
        if (is_notifications_loading_completed && !!count)
            setCounter(<Counter count={count} className='notifications-toggle__step' />);
        // set null only if loading completed and count == 0
        else if (is_notifications_loading_completed && !count) setCounter(null);
        // another way when loading is in progress doesn't change the counter
    }, [is_notifications_loading_completed, count]);

    const notifications_toggler_el = (
        <div
            className={classNames('notifications-toggle__icon-wrapper', {
                'notifications-toggle__icon-wrapper--active': is_visible,
            })}
            onClick={toggleDialog}
        >
            <Icon className='notifications-toggle__icon' icon='IcBell' />
            {counter}
        </div>
    );

    return (
        <div
            className={classNames('notifications-toggle', {
                'notifications-toggle--active': is_visible,
            })}
        >
            <DesktopWrapper>
                <Popover
                    classNameBubble='notifications-toggle__tooltip'
                    alignment='bottom'
                    message={tooltip_message}
                    should_disable_pointer_events={should_disable_pointer_events}
                    zIndex={9999}
                >
                    {notifications_toggler_el}
                </Popover>
                <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
            </DesktopWrapper>
            <MobileWrapper>
                {notifications_toggler_el}
                <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
            </MobileWrapper>
        </div>
    );
};

export default observer(ToggleNotificationsDrawer);
