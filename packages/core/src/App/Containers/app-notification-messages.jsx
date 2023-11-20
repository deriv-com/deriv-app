import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { isMobile, routes } from '@deriv/shared';
import 'Sass/app/_common/components/app-notification-message.scss';
import Notification, {
    max_display_notifications,
    max_display_notifications_mobile,
} from '../Components/Elements/NotificationMessage';
import { connect } from 'Stores/connect';
import { useLocation } from 'react-router-dom';
import {
    excluded_notifications,
    priority_toast_messages,
    maintenance_notifications,
} from '../../Stores/Helpers/client-notifications';

const Portal = ({ children }) =>
    isMobile() ? ReactDOM.createPortal(children, document.getElementById('deriv_app')) : children;

const NotificationsContent = ({ is_notification_loaded, style, notifications, removeNotificationMessage }) => {
    const { pathname } = useLocation();

    return (
        <div
            className={classNames('notification-messages', {
                'notification-messages--traders-hub': pathname === routes.traders_hub,
            })}
            style={style}
        >
            <TransitionGroup component='div'>
                {notifications.map(notification => (
                    <CSSTransition
                        appear={!!is_notification_loaded}
                        key={notification.key}
                        in={!!notification.header}
                        timeout={150}
                        classNames={{
                            appear: 'notification--enter',
                            enter: 'notification--enter',
                            enterDone: 'notification--enter-done',
                            exit: 'notification--exit',
                        }}
                        unmountOnExit
                    >
                        <Notification data={notification} removeNotificationMessage={removeNotificationMessage} />
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>
    );
};

const AppNotificationMessages = ({
    is_notification_loaded,
    is_mt5,
    marked_notifications,
    notification_messages,
    removeNotificationMessage,
    stopNotificationLoading,
    markNotificationMessage,
    should_show_popups,
}) => {
    const [style, setStyle] = React.useState({});
    const [notifications_ref, setNotificationsRef] = React.useState(null);

    React.useEffect(() => {
        if (is_mt5) {
            stopNotificationLoading();
        }
        if (notifications_ref && isMobile()) {
            if (notifications_ref.parentElement !== null) {
                const bounds = notifications_ref.parentElement.getBoundingClientRect();
                setStyle({ top: bounds.top + 8 });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_mt5, notifications_ref]);

    const notificationsMsg = notification_messages.filter(message => {
        const is_not_marked_notification = !marked_notifications.includes(message.key);
        const is_non_hidden_notification = isMobile()
            ? [
                  ...maintenance_notifications,
                  'authenticate',
                  'deriv_go',
                  'document_needs_action',
                  'dp2p',
                  'contract_sold',
                  'has_changed_two_fa',
                  'identity',
                  'install_pwa',
                  'need_fa',
                  'notify_financial_assessment',
                  'poi_name_mismatch',
                  'poa_address_mismatch_failure',
                  'poa_address_mismatch_success',
                  'poa_address_mismatch_warning',
                  'poa_expired',
                  'poa_failed',
                  'poa_rejected_for_mt5',
                  'poa_verified',
                  'poi_expired',
                  'poi_failed',
                  'poi_verified',
                  'p2p_daily_limit_increase',
                  'resticted_mt5_with_failed_poa',
                  'resticted_mt5_with_pending_poa',
                  'svg_needs_poa',
                  'svg_needs_poi',
                  'svg_needs_poi_poa',
                  'svg_poi_expired',
                  'wallets_migrated',
                  'wallets_failed',
                  'tnc',
                  'trustpilot',
                  'unwelcome',
                  'additional_kyc_info',
              ].includes(message.key) || message.type === 'p2p_completed_order'
            : true;

        const is_only_for_p2p_notification =
            window.location.pathname !== routes.cashier_p2p || message?.platform === 'P2P';

        const is_maintenance_notifications = maintenance_notifications.includes(message.key);

        return (
            is_not_marked_notification &&
            is_non_hidden_notification &&
            (is_only_for_p2p_notification || is_maintenance_notifications)
        );
    });

    const notifications_limit = isMobile() ? max_display_notifications_mobile : max_display_notifications;
    //TODO (yauheni-kryzhyk): showing pop-up only for specific messages. the rest of notifications are hidden. this logic should be changed in the upcoming new pop-up notifications implementation

    const filtered_excluded_notifications = notificationsMsg.filter(message =>
        priority_toast_messages.includes(message.key) || message.type.includes('p2p')
            ? message
            : excluded_notifications.includes(message.key)
    );

    const notifications_sublist =
        window.location.pathname === routes.cashier_deposit
            ? filtered_excluded_notifications.filter(message =>
                  ['switched_to_real', ...maintenance_notifications].includes(message.key)
              )
            : filtered_excluded_notifications.slice(0, notifications_limit);

    if (!should_show_popups) return null;

    return notifications_sublist.length ? (
        <div ref={ref => setNotificationsRef(ref)} className='notification-messages-bounds'>
            <Portal>
                <NotificationsContent
                    notifications={notifications_sublist}
                    is_notification_loaded={is_notification_loaded}
                    style={style}
                    removeNotificationMessage={removeNotificationMessage}
                    markNotificationMessage={markNotificationMessage}
                />
            </Portal>
        </div>
    ) : null;
};

AppNotificationMessages.propTypes = {
    is_mt5: PropTypes.bool,
    is_notification_loaded: PropTypes.bool,
    marked_notifications: PropTypes.array,
    markNotificationMessage: PropTypes.func,
    notification_messages: PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick: PropTypes.func,
            delay: PropTypes.number,
            header: PropTypes.string,
            is_auto_close: PropTypes.bool,
            message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            size: PropTypes.oneOf(['small']),
            type: PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold', 'news', 'announce']),
        })
    ),
    removeNotificationMessage: PropTypes.func,
    should_show_popups: PropTypes.bool,
    stopNotificationLoading: PropTypes.func,
};

export default connect(({ notifications }) => ({
    marked_notifications: notifications.marked_notifications,
    notification_messages: notifications.notification_messages,
    removeNotificationMessage: notifications.removeNotificationMessage,
    markNotificationMessage: notifications.markNotificationMessage,
    should_show_popups: notifications.should_show_popups,
}))(AppNotificationMessages);
