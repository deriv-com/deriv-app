import PropTypes from 'prop-types';
import React from 'react';
import { Text } from '@deriv/components';
import CloseButton from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';

const NotificationAdTypeChanged = ({ header, message, onClose }) => {
    setTimeout(onClose, 60000);

    return (
        <div className='notification notification-announce notification--order-successful'>
            <div className='notification__icon-background notification__icon-background--header-only'>
                <NotificationStatusIcons type='announce' class_suffix='is-background' />
            </div>
            <div className='notification__icon'>
                <NotificationStatusIcons type='announce' />
            </div>
            <div className='notification__text-container'>
                <Text as='h4' weight='bold' className='notification__header'>
                    {header}
                </Text>
                <Text as='p' className='notification__text-body'>
                    {message}
                </Text>
            </div>
            <CloseButton className='notification__close-button' onClick={onClose} />
        </div>
    );
};

NotificationAdTypeChanged.propTypes = {
    header: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
};

export default NotificationAdTypeChanged;
