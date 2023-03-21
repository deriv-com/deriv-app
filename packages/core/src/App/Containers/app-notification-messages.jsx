import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { isMobile, getPathname, getPlatformSettings, routes } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { excluded_notifications } from '../../Stores/Helpers/client-notifications';
import Notification, {
    max_display_notifications,
    max_display_notifications_mobile,
} from '../Components/Elements/NotificationMessage';
import 'Sass/app/_common/components/app-notification-message.scss';
import classNames from 'classnames';

const Portal = ({ children }) =>
    isMobile() ? ReactDOM.createPortal(children, document.getElementById('deriv_app')) : children;

const NotificationsContent = ({
    is_notification_loaded,
    style,
    is_pre_appstore,
    notifications,
    removeNotificationMessage,
    markNotificationMessage,
    landing_company_shortcode,
    has_iom_account,
    has_malta_account,
    is_logged_in,
}) => {
    // TODO: Remove this useEffect when MX and MLT account closure has finished.
    const window_location = window.location;
    React.useEffect(() => {
        if ((has_iom_account || has_malta_account) && is_logged_in) {
            const get_close_mx_mlt_notification = notifications.find(item => item.key === 'close_mx_mlt_account');
            const is_dtrader = getPathname() === getPlatformSettings('trader').name;
            const malta_account = landing_company_shortcode === 'malta';
            const iom_account = landing_company_shortcode === 'iom';
            if ((!is_dtrader && get_close_mx_mlt_notification) || malta_account || iom_account) {
                markNotificationMessage({ key: 'close_mx_mlt_account' });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window_location]);

    return (
        <div
            className={classNames('notification-messages', {
                'notification-messages--traders-hub': is_pre_appstore,
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
    is_pre_appstore,
    marked_notifications,
    notification_messages,
    removeNotificationMessage,
    stopNotificationLoading,
    markNotificationMessage,
    landing_company_shortcode,
    has_iom_account,
    has_malta_account,
    is_logged_in,
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

    const notifications = notification_messages.filter(message => {
        const is_not_marked_notification = !marked_notifications.includes(message.key);
        const is_non_hidden_notification = isMobile()
            ? [
                  'unwelcome',
                  'contract_sold',
                  'dp2p',
                  'install_pwa',
                  'tnc',
                  'risk_client',
                  'deriv_go',
                  'close_mx_mlt_account',
                  'trustpilot',
                  'close_uk_account',
                  'p2p_daily_limit_increase',
                  'document_needs_action',
                  'identity',
                  'poi_name_mismatch',
                  'poi_expired',
                  'poi_failed',
                  'poi_verified',
                  'poa_expired',
                  'resticted_mt5_with_pending_poa',
                  'poa_verified',
                  'poa_failed',
                  'resticted_mt5_with_failed_poa',
                  'poa_rejected_for_mt5',
                  'poa_address_mismatch_warning',
                  'poa_address_mismatch_success',
                  'poa_address_mismatch_failure',
                  'svg_needs_poi_poa',
                  'svg_needs_poa',
                  'svg_needs_poi',
                  'svg_poi_expired',
              ].includes(message.key) || message.type === 'p2p_completed_order'
            : true;

        const is_only_for_p2p_notification =
            window.location.pathname !== routes.cashier_p2p || message?.platform === 'P2P';
        return is_not_marked_notification && is_non_hidden_notification && is_only_for_p2p_notification;
    });

    const notifications_limit = isMobile() ? max_display_notifications_mobile : max_display_notifications;
    //TODO (yauheni-kryzhyk): showing pop-up only for specific messages. the rest of notifications are hidden. this logic should be changed in the upcoming new pop-up notifications implementation
    const filtered_excluded_notifications = notifications.filter(message =>
        message.key.includes('svg') || message.key.includes('p2p_daily_limit_increase')
            ? message
            : excluded_notifications.includes(message.key)
    );
    const notifications_sublist = filtered_excluded_notifications.slice(0, notifications_limit);

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
                    landing_company_shortcode={landing_company_shortcode}
                    has_iom_account={has_iom_account}
                    has_malta_account={has_malta_account}
                    is_logged_in={is_logged_in}
                    is_pre_appstore={is_pre_appstore}
                />
            </Portal>
        </div>
    ) : null;
};

AppNotificationMessages.propTypes = {
    has_iom_account: PropTypes.bool,
    has_malta_account: PropTypes.bool,
    is_logged_in: PropTypes.bool,
    is_mt5: PropTypes.bool,
    is_notification_loaded: PropTypes.bool,
    landing_company_shortcode: PropTypes.string,
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
            type: PropTypes.oneOf([
                'warning',
                'info',
                'success',
                'danger',
                'contract_sold',
                'news',
                'announce',
                'close_mx_mlt',
            ]),
        })
    ),
    removeNotificationMessage: PropTypes.func,
    should_show_popups: PropTypes.bool,
    stopNotificationLoading: PropTypes.func,
    is_pre_appstore: PropTypes.bool,
};

export default connect(({ client, notifications }) => ({
    marked_notifications: notifications.marked_notifications,
    notification_messages: notifications.notification_messages,
    removeNotificationMessage: notifications.removeNotificationMessage,
    markNotificationMessage: notifications.markNotificationMessage,
    landing_company_shortcode: client.landing_company_shortcode,
    has_iom_account: client.has_iom_account,
    has_malta_account: client.has_malta_account,
    is_logged_in: client.is_logged_in,
    should_show_popups: notifications.should_show_popups,
    is_pre_appstore: client.is_pre_appstore,
}))(AppNotificationMessages);
