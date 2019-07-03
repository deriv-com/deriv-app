import PropTypes                from 'prop-types';
import React                    from 'react';
import { connect }              from 'Stores/connect';
import Notification, {
    max_display_notifications } from '../Components/Elements/NotificationMessage';

const NotificationMessages = ({
    notification_messages,
    removeNotification,
}) => (
    <div className='notification-messages'>
        {
            notification_messages
                .slice(0, max_display_notifications)
                .map((notification, idx) => (
                    <Notification
                        key={idx}
                        data={notification}
                        removeNotification={removeNotification}
                    />
                ))
        }
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
    removeNotification: PropTypes.func,
};

export default connect(
    ({ ui }) => ({
        notification_messages: ui.notification_messages,
        removeNotification   : ui.removeNotification,
    })
)(NotificationMessages);
