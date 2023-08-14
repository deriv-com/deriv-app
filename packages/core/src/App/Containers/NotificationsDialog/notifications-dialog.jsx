import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { DesktopWrapper, MobileDialog, MobileWrapper, useOnClickOutside } from '@deriv/components';
import { LocalStore } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import NotificationListWrapper from './notification-list-wrapper';

const NotificationsDialog = ({
    is_visible,
    loginid,
    notifications,
    toggleDialog,
    removeNotificationMessage,
    removeNotificationMessageByKey,
    removeNotifications,
}) => {
    const wrapper_ref = React.useRef();

    const handleClickOutside = event => {
        const notifications_toggle_btn = !event.target.classList.contains('notifications-toggle__icon-wrapper');
        if (!wrapper_ref.current?.contains(event.target) && is_visible && notifications_toggle_btn) {
            toggleDialog();
        }
    };

    const clearNotifications = () => {
        const p2p_settings = LocalStore.getObject('p2p_settings');
        if (p2p_settings[loginid]) {
            p2p_settings[loginid].is_notifications_visible = false;
        }
        LocalStore.setObject('p2p_settings', p2p_settings);

        notifications.forEach(item => {
            removeNotificationMessageByKey(item.key);
            removeNotificationMessage({
                key: item.key,
                should_show_again: item.should_show_again || false,
            });
            removeNotifications(true);
        });
    };

    useOnClickOutside(wrapper_ref, handleClickOutside);

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    title={localize('Notifications')}
                    wrapper_classname='notifications-mobile-dialog'
                    visible={is_visible}
                    onClose={toggleDialog}
                >
                    <NotificationListWrapper clearNotifications={clearNotifications} ref={wrapper_ref} />
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <CSSTransition
                    in={is_visible}
                    classNames={{
                        enter: 'notifications-dialog--enter',
                        enterDone: 'notifications-dialog--enter-done',
                        exit: 'notifications-dialog--exit',
                    }}
                    timeout={150}
                    unmountOnExit
                >
                    <NotificationListWrapper clearNotifications={clearNotifications} ref={wrapper_ref} />
                </CSSTransition>
            </DesktopWrapper>
        </React.Fragment>
    );
};

NotificationsDialog.propTypes = {
    is_visible: PropTypes.bool,
    loginid: PropTypes.string,
    notifications: PropTypes.array,
    toggleDialog: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
    removeNotifications: PropTypes.func,
};

export default connect(({ common, client, notifications }) => ({
    app_routing_history: common.app_routing_history,
    loginid: client.loginid,
    notifications: notifications.notifications,
    removeNotificationByKey: notifications.removeNotificationByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotifications: notifications.removeNotifications,
    removeNotificationMessageByKey: notifications.removeNotificationMessageByKey,
}))(NotificationsDialog);
