import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import {
    Button,
    DesktopWrapper,
    Icon,
    MobileDialog,
    MobileWrapper,
    ThemedScrollbars,
    Text,
    useOnClickOutside,
} from '@deriv/components';
import { BinaryLink } from 'App/Components/Routes';
import { connect } from 'Stores/connect';
import { localize, Localize } from '@deriv/translations';
import { toTitleCase, isEmptyObject, isMobile, PlatformContext } from '@deriv/shared';
import { EmptyNotification } from 'App/Components/Elements/Notifications/empty-notification.jsx';

const NotificationsList = ({ notifications, toggleDialog }) => {
    const getNotificationitemIcon = item => {
        const { type } = item;
        if (['contract_sold', 'info'].includes(type)) {
            return 'IcAlertInfo';
        } else if (type === 'p2p_completed_order') {
            return 'IcAlertAnnounce';
        }

        return `IcAlert${toTitleCase(type)}`;
    };

    const getButtonSettings = item =>
        ['action', 'secondary_btn', 'cta_btn', 'primary_btn'].find(obj_key => !isEmptyObject(item[obj_key]));

    return (
        <React.Fragment>
            {notifications.map(item => (
                <div className='notifications-item' key={item.key}>
                    <Text
                        as='h2'
                        className='notifications-item__title'
                        weight='bold'
                        size='xs'
                        line_height='m'
                        color='prominent'
                    >
                        {item.type && (
                            <Icon
                                icon={getNotificationitemIcon(item)}
                                className={classNames('notifications-item__title-icon', {
                                    [`notifications-item__title-icon--${item.type}`]: item.type,
                                })}
                            />
                        )}
                        {item.header}
                    </Text>
                    <div className='notifications-item__message'>{item.message}</div>
                    <div className='notifications-item__action'>
                        {!!getButtonSettings(item) && (
                            <React.Fragment>
                                {item[getButtonSettings(item)].route ? (
                                    <BinaryLink
                                        onClick={toggleDialog}
                                        active_class='notifications-item'
                                        className={classNames(
                                            'dc-btn',
                                            'dc-btn--secondary',
                                            'notifications-item__cta-button'
                                        )}
                                        to={item[getButtonSettings(item)].route}
                                    >
                                        <Text weight='bold' size='xxs'>
                                            {item[getButtonSettings(item)].text}
                                        </Text>
                                    </BinaryLink>
                                ) : (
                                    <Button
                                        className={classNames('dc-btn--secondary', 'notifications-item__cta-button')}
                                        onClick={item[getButtonSettings(item)].onClick}
                                    >
                                        <Text weight='bold' size='xxs'>
                                            {item[getButtonSettings(item)].text}
                                        </Text>
                                    </Button>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                </div>
            ))}
        </React.Fragment>
    );
};
const NotificationListWrapper = React.forwardRef(
    (
        { notifications, toggleDialog, removeNotificationMessage, removeNotificationMessageByKey, removeNotifications },
        ref
    ) => {
        const is_empty = !notifications.length;
        const { is_pre_appstore } = React.useContext(PlatformContext);

        const clearNotifications = () => {
            // console.log(notifications.map((item)=> item.key))
            notifications.map(item => {
                //     console.log("notificartions",item.key)
                //     removeNotificationMessageByKey({key: item.key})
                //     console.log("after functionns")
                // })
                removeNotifications(true);
                // removeAllNotificationMessages(true);
                removeNotificationMessage({
                    key: item.key,
                    should_show_again: false,
                });
                removeNotificationMessageByKey(item.key);
                // removeAllNotificationMessages(true)
            });
            // updateNotifications([]);
        };

        return (
            <div
                className={classNames('notifications-dialog', {
                    'notifications-dialog--pre-appstore': is_pre_appstore,
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
                <div className='notifications-dialog__separator' />
                <div
                    className={classNames('notifications-dialog__footer', {
                        'notifications-dialog__content--empty': is_empty,
                    })}
                >
                    <Button
                        className={classNames('dc-btn--secondary', 'notifications-dialog__clear')}
                        onClick={clearNotifications}
                    >
                        <Text size='xxs' color='prominent' weight='bold'>
                            {localize('Clear All')}
                        </Text>
                    </Button>
                </div>
            </div>
        );
    }
);
NotificationListWrapper.displayName = 'NotificationListWrapper';

const NotificationsDialog = ({
    is_visible,
    notifications,
    toggleDialog,
    removeNotificationMessage,
    removeAllNotificationMessages,
    removeNotificationByKey,
    removeNotificationMessageByKey,
    updateNotifications,
    removeNotifications,
}) => {
    const wrapper_ref = React.useRef();

    const handleClickOutside = event => {
        const notifications_toggle_btn = !event.target.classList.contains('notifications-toggle__icon-wrapper');
        if (!wrapper_ref.current?.contains(event.target) && is_visible && notifications_toggle_btn) {
            toggleDialog();
        }
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
                        removeAllNotificationMessages={removeAllNotificationMessages}
                        // markNotificationMessage={markNotificationMessage}
                        removeNotificationMessage={removeNotificationMessage}
                        removeNotificationByKey={removeNotificationByKey}
                        updateNotifications={updateNotifications}
                        removeNotifications={removeNotifications}
                        // setClientNotifications={setClientNotifications}
                        removeNotificationMessageByKey={removeNotificationMessageByKey}
                    />
                </CSSTransition>
            </DesktopWrapper>
        </React.Fragment>
    );
};

NotificationsDialog.propTypes = {
    is_visible: PropTypes.bool,
    notifications: PropTypes.array,
    toggleDialog: PropTypes.func,
    removeNotificationMessage: PropTypes.func,
    removeAllNotificationMessages: PropTypes.func,
    removeNotificationByKey: PropTypes.func,
    updateNotifications: PropTypes.func,
    markNotificationMessage: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
    removeNotifications: PropTypes.func,
};

export default connect(({ common, notifications }) => ({
    notifications: notifications.notifications,
    app_routing_history: common.app_routing_history,
    removeNotificationByKey: notifications.removeNotificationByKey,
    removeNotificationMessage: notifications.removeNotificationMessage,
    removeNotifications: notifications.removeNotifications,
    removeAllNotificationMessages: notifications.removeAllNotificationMessages,
    updateNotifications: notifications.updateNotifications,
    removeNotificationMessageByKey: notifications.removeNotificationMessageByKey,
}))(NotificationsDialog);
