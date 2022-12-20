import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import { Button, Text } from '@deriv/components';
import { isEmptyObject } from '@deriv/shared';
import { BinaryLink } from 'App/Components/Routes';
import CloseButton from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';

const NotificationOrder = ({ action, header, message, onClose }) => {
    setTimeout(onClose, 60000);

    return (
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
                    {!isEmptyObject(action) && (
                        <React.Fragment>
                            {action.route ? (
                                <BinaryLink
                                    className={classNames('dc-btn', 'dc-btn--secondary', 'notification__cta-button')}
                                    onClick={onClose}
                                    to={action.route}
                                >
                                    <Text size='xxs' weight='bold'>
                                        {action.text}
                                    </Text>
                                </BinaryLink>
                            ) : (
                                <Button
                                    className='notification__cta-button'
                                    text={action.text}
                                    onClick={() => {
                                        action.onClick();
                                        onClose();
                                    }}
                                    secondary
                                    renderText={text => (
                                        <Text size='xxs' weight='bold' align='center'>
                                            {text}
                                        </Text>
                                    )}
                                />
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
            <CloseButton className='notification__close-button' onClick={onClose} />
        </div>
    );
};

NotificationOrder.propTypes = {
    action: PropTypes.object,
    header: PropTypes.string,
    is_auto_close: PropTypes.bool,
    message: PropTypes.string,
    onClose: PropTypes.func,
};

export default NotificationOrder;
