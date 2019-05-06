import PropTypes       from 'prop-types';
import React           from 'react';
import { connect }     from 'Stores/connect';
import NotificationBar from '../Components/Elements/Notifications/notification-bar.jsx';

const PushNotification = ({
    push_notifications,
}) => (
    push_notifications.map((notification, idx) => {
        const { autoShow, content, duration, type } = notification;
        return (
            <NotificationBar
                key={idx}
                autoShow={autoShow}
                content={content}
                duration={duration}
                type={type || 'info'}
                has_content_close={true}
            />
        );
    })
);

PushNotification.propTypes = {
    push_notifications: PropTypes.array,
};

export default connect(
    ({ ui }) => ({
        push_notifications: ui.push_notifications,
    })
)(PushNotification);
