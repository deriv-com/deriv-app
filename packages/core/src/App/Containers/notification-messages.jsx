import PropTypes                from 'prop-types';
import React                    from 'react';
import {
    TransitionGroup,
    CSSTransition }             from 'react-transition-group';
import { connect }              from 'Stores/connect';
import Notification, {
    max_display_notifications } from '../Components/Elements/NotificationMessage';
import                               'Sass/app/_common/components/notification-message.scss';

const NotificationMessages = ({
    marked_notifications,
    notification_messages,
    removeNotificationMessage,
}) => (
    <div className='notification-messages'>
        <TransitionGroup component='div'>
            {
                notification_messages
                    .filter(message => !marked_notifications.includes(message.key))
                    .slice(0, max_display_notifications)
                    .map((notification, idx) => (
                        <CSSTransition
                            appear
                            key={idx}
                            in={!!notification.header}
                            timeout={150}
                            classNames={{
                                appear   : 'notification--enter',
                                enter    : 'notification--enter',
                                enterDone: 'notification--enter-done',
                                exit     : 'notification--exit',
                            }}
                            unmountOnExit
                        >
                            <Notification
                                data={notification}
                                removeNotificationMessage={removeNotificationMessage}
                            />
                        </CSSTransition>
                    ))
            }
        </TransitionGroup>
    </div>
);

NotificationMessages.propTypes = {
    notification_messages: PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick : PropTypes.func,
            delay        : PropTypes.number,
            header       : PropTypes.string,
            is_auto_close: PropTypes.bool,
            message      : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            size         : PropTypes.oneOf(['small']),
            type         : PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold']),
        }),
    ),
    removeNotificationMessage: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        marked_notifications     : ui.marked_notifications,
        notification_messages    : ui.notification_messages,
        removeNotificationMessage: ui.removeNotificationMessage,
    })
)(NotificationMessages);
