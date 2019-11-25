import classNames              from 'classnames';
import PropTypes               from 'prop-types';
import React                   from 'react';
import { Button }              from 'deriv-components';
import ObjectUtils             from 'deriv-shared/utils/object';
import CloseButton             from './close-button.jsx';
import NotificationStatusIcons from './notification-status-icons.jsx';
import {
    default_delay,
    types }                    from './constants';
import { BinaryLink }          from '../../Routes';

const Notification = ({
    data,
    removeNotificationMessage,
}) => {
    const destroy = (is_closed_by_user) => {
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
        <div className={
            classNames('notification', types[data.type], {
                'notification--small': (data.size === 'small'),
            })}
        >
            <div className='notification__icon-background'>
                <NotificationStatusIcons type={data.type} class_suffix='is-background' />
            </div>
            <div className='notification__icon'>
                <NotificationStatusIcons type={data.type} />
            </div>
            <div className='notification__text-container'>
                <h4 className='notification__header'>
                    {data.header}
                </h4>
                <p className='notification__text-body'>
                    {data.message}
                </p>
                {!ObjectUtils.isEmptyObject(data.action) &&
                    <React.Fragment>
                        { data.action.route ?
                            <BinaryLink
                                className={classNames('btn', 'btn--secondary', 'notification__cta-button')}
                                to={data.action.route}
                            >
                                <span className='btn__text'>{data.action.text}</span>
                            </BinaryLink>
                            :
                            <Button
                                className='notification__cta-button'
                                onClick={data.action.onClick}
                                text={data.action.text}
                                secondary
                            />
                        }
                    </React.Fragment>
                }
            </div>
            { data.should_hide_close_btn ?
                undefined
                :
                <CloseButton
                    className='notification__close-button'
                    onClick={onClick}
                />
            }
        </div>
    );
};

Notification.propTypes = {
    data: PropTypes.shape({
        action: PropTypes.shape({
            onClick: PropTypes.func,
            route  : PropTypes.string,
            text   : PropTypes.string,
        }),
        closeOnClick         : PropTypes.func,
        delay                : PropTypes.number,
        header               : PropTypes.string,
        is_auto_close        : PropTypes.bool,
        message              : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
        should_hide_close_btn: PropTypes.bool,
        size                 : PropTypes.oneOf(['small']),
        type                 : PropTypes.oneOf(['warning', 'info', 'success', 'danger', 'contract_sold']).isRequired,
    }),
    removeNotificationMessage: PropTypes.func,
};

export default Notification;
