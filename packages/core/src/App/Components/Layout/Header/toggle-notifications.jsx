import classNames from 'classnames';
import React from 'react';
import { Counter, DesktopWrapper, Icon, MobileWrapper, Popover } from '@deriv/components';
import NotificationsDialog from 'App/Containers/NotificationsDialog';
import 'Sass/app/modules/notifications-dialog.scss';
// import { useStore } from '@deriv/stores';
import { connect } from 'Stores/connect';

const ToggleNotificationsDrawer = ({
    count,
    is_visible,
    toggleDialog,
    tooltip_message,
    is_notifications_loading_completed,
    should_disable_pointer_events = false,
}) => {
    // const {
    //     notifications: { is_notifications_loading_completed },
    // } = useStore();

    // console.log(
    //     'ToggleNotifications: count = ',
    //     count,
    //     ', is_notifications_loading_completed = ',
    //     is_notifications_loading_completed
    // );

    const notifications_toggler_el = React.useMemo(
        () => (
            <div
                className={classNames('notifications-toggle__icon-wrapper', {
                    'notifications-toggle__icon-wrapper--active': is_visible,
                })}
                onClick={toggleDialog}
            >
                <Icon className='notifications-toggle__icon' icon='IcBell' />
                {!!count && is_notifications_loading_completed && (
                    <Counter count={count} className='notifications-toggle__step' />
                )}
            </div>
        ),
        [count, is_notifications_loading_completed, is_visible, toggleDialog]
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
                    {is_notifications_loading_completed && notifications_toggler_el}
                </Popover>
                <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
            </DesktopWrapper>
            <MobileWrapper>
                {is_notifications_loading_completed && notifications_toggler_el}
                <NotificationsDialog is_visible={is_visible} toggleDialog={toggleDialog} />
            </MobileWrapper>
        </div>
    );
};

export default connect(({ notifications }) => ({
    is_notifications_loading_completed: notifications.is_notifications_loading_completed,
}))(ToggleNotificationsDrawer);
