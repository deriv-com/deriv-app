import PropTypes from 'prop-types';
import React from 'react';
import { Button, Text } from '@deriv/components';
import CloseButton from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';

const NotificationOrder = ({ action, header, message, onClose }) => (
    <div className='notification notification-announce notification--order-successful'>
        <div className='notification__icon-background'>
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
            <div className='notification__action'>
                <Button
                    className='notification__cta-button'
                    onClick={() => {
                        action.onClick();
                        onClose();
                    }}
                    text={action.text}
                    secondary
                    renderText={text => (
                        <Text size='xxs' weight='bold' align='center'>
                            {text}
                        </Text>
                    )}
                />
            </div>
        </div>
        <CloseButton className='notification__close-button' onClick={onClose} />
    </div>
);

NotificationOrder.propTypes = {
    action: PropTypes.object,
    header: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
};

export default NotificationOrder;
