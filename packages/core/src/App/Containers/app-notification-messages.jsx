import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { connect } from 'Stores/connect';
import Notification, { max_display_notifications } from '../Components/Elements/NotificationMessage';
import 'Sass/app/_common/components/app-notification-message.scss';

class AppNotificationMessages extends React.Component {
    state = {};
    setRef = el => {
        if (el && el.parentElement) {
            this.setState({
                bounds: el.parentElement.getBoundingClientRect(),
            });
        }
    };

    render() {
        const allowed_on_mobile = ['mf_retail', 'unwelcome', 'contract_sold'];

        const { marked_notifications, notification_messages, removeNotificationMessage } = this.props;
        const { bounds } = this.state;
        const style = isMobile()
            ? {
                  top: bounds && bounds.top + 8,
              }
            : null;

        const notifications = notification_messages
            .filter(
                message =>
                    !marked_notifications.includes(message.key) &&
                    (isMobile() ? allowed_on_mobile.includes(message.key) : true)
            )
            .slice(0, max_display_notifications);

        if (notifications.length === 0) return null;

        const content = (
            <div className='notification-messages' style={style}>
                <TransitionGroup component='div'>
                    {notifications.map((notification, idx) => (
                        <CSSTransition
                            appear
                            key={idx}
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

        const portal = ReactDOM.createPortal(content, document.getElementById('deriv_app'));

        return (
            <React.Fragment>
                <DesktopWrapper>{content}</DesktopWrapper>
                <MobileWrapper>
                    <div ref={this.setRef} className='notification-messages-bounds'>
                        {portal}
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }
}

AppNotificationMessages.propTypes = {
    notification_messages: PropTypes.arrayOf(
        PropTypes.shape({
            closeOnClick: PropTypes.func,
            delay: PropTypes.number,
            header: PropTypes.string,
            is_auto_close: PropTypes.bool,
            message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
            size: PropTypes.oneOf(['small']),
            type: PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold']),
        })
    ),
    removeNotificationMessage: PropTypes.func,
};

export default connect(({ ui }) => ({
    marked_notifications: ui.marked_notifications,
    notification_messages: ui.notification_messages,
    removeNotificationMessage: ui.removeNotificationMessage,
}))(AppNotificationMessages);
