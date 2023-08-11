import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    DesktopWrapper,
    MobileDialog,
    MobileWrapper,
    Text,
    ThemedScrollbars,
    useOnClickOutside,
} from '@deriv/components';
import { isMobile, LocalStore, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import EmptyNotification from 'App/Components/Elements/Notifications/empty-notification.jsx';
import { connect } from 'Stores/connect';
import ClearAllFooter from './notifications-clear-all-footer';
import NotificationsList from './notifications-list';

const NotificationListWrapper = React.forwardRef(({ notifications, toggleDialog, clearNotifications }, ref) => {
    const is_empty = !notifications?.length;

    const traders_hub = window.location.pathname === routes.traders_hub;

    return (
        <div
            className={classNames('notifications-dialog', {
                'notifications-dialog--pre-appstore':
                    traders_hub || window.location.pathname.startsWith(routes.account),
            })}
            ref={ref}
        >
            <div className='notifications-dialog__header'>
                <Text
                    as='h2'
                    className='notifications-dialog__header-text'
                    size='s'
                    weight='bold'
                    color='prominent'
                    styles={{
                        lineHeight: '1.6rem',
                    }}
                >
                    <Localize i18n_default_text='Notifications' />
                </Text>
            </div>
            <div
                className={classNames('notifications-dialog__content', {
                    'notifications-dialog__content--empty': is_empty,
                })}
            >
                <ThemedScrollbars is_bypassed={isMobile() || is_empty}>
                    {is_empty ? (
                        <EmptyNotification />
                    ) : (
                        <NotificationsList notifications={notifications} toggleDialog={toggleDialog} />
                    )}
                </ThemedScrollbars>
            </div>
            <ClearAllFooter clearNotifications={clearNotifications} is_empty={is_empty} />
        </div>
    );
});

NotificationListWrapper.displayName = 'NotificationListWrapper';

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
                    <NotificationListWrapper
                        notifications={notifications}
                        ref={wrapper_ref}
                        toggleDialog={toggleDialog}
                        clearNotifications={clearNotifications}
                    />
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
                    <NotificationListWrapper
                        notifications={notifications}
                        ref={wrapper_ref}
                        toggleDialog={toggleDialog}
                        removeNotificationMessage={removeNotificationMessage}
                        removeNotifications={removeNotifications}
                        removeNotificationMessageByKey={removeNotificationMessageByKey}
                        clearNotifications={clearNotifications}
                    />
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
