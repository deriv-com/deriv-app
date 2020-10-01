import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, LinearProgress } from '@deriv/components';
import { isEmptyObject, PlatformContext } from '@deriv/shared';
import CloseButton from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';
import { default_delay, types } from './constants';
import { BinaryLink } from '../../Routes';

const Notification = ({ data, removeNotificationMessage }) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const destroy = is_closed_by_user => {
        removeNotificationMessage(data);

        if (data.closeOnClick) {
            data.closeOnClick(data, is_closed_by_user);
        }
    };

    const onClick = () => destroy(true);

    if (data.is_auto_close) {
        setTimeout(destroy, data.delay || default_delay);
    }

    return (
        <div
            className={classNames('notification', types[data.type], {
                'notification--small': data.size === 'small',
            })}
        >
            <div className='notification__icon-background'>
                <NotificationStatusIcons type={data.type} class_suffix='is-background' />
            </div>
            <div className='notification__icon'>
                <NotificationStatusIcons type={data.type} />
            </div>
            <div className='notification__text-container'>
                <h4 className='notification__header'>{data.header}</h4>
                {data.timeout && (
                    <LinearProgress
                        className='notification__timeout'
                        timeout={data.timeout}
                        action={data.action.onClick}
                        render={data.timeoutMessage}
                    />
                )}
                <p className='notification__text-body'>{data.message}</p>
                <div className='notification__action'>
                    {!isEmptyObject(data.action) && (
                        <React.Fragment>
                            {data.action.route ? (
                                <BinaryLink
                                    className={classNames('dc-btn', 'dc-btn--secondary', 'notification__cta-button')}
                                    to={data.action.route}
                                >
                                    <span className='dc-btn__text'>{data.action.text}</span>
                                </BinaryLink>
                            ) : (
                                <Button
                                    className='notification__cta-button'
                                    onClick={() => data.action.onClick({ is_deriv_crypto })}
                                    text={data.action.text}
                                    secondary
                                />
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
            {!data.should_hide_close_btn && <CloseButton className='notification__close-button' onClick={onClick} />}
        </div>
    );
};

Notification.propTypes = {
    data: PropTypes.shape({
        action: PropTypes.shape({
            onClick: PropTypes.func,
            route: PropTypes.string,
            text: PropTypes.string,
        }),
        closeOnClick: PropTypes.func,
        delay: PropTypes.number,
        header: PropTypes.string,
        is_auto_close: PropTypes.bool,
        message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        should_hide_close_btn: PropTypes.bool,
        size: PropTypes.oneOf(['small']),
        type: PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold']).isRequired,
    }),
    removeNotificationMessage: PropTypes.func,
};

export default Notification;
