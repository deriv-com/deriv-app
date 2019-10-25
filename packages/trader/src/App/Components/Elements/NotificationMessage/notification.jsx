import PropTypes   from 'prop-types';
import React       from 'react';
import classNames  from 'classnames';
// import { Button }  from 'deriv-components';
import Icon        from 'Assets/icon.jsx';
import CloseButton from './close-button.jsx';
import {
    default_delay,
    icon_types,
    types }        from './constants';

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

    const IconTypes = ({ type, class_suffix }) => (
        <React.Fragment>
            { !!type &&
                <Icon
                    icon={icon_types[type]}
                    className={classNames('notification__icon-type', {
                        [`notification__icon-type--${class_suffix}`]: class_suffix,
                    })}
                />
            }
        </React.Fragment>
    );

    return (
        <div className={
            classNames('notification', types[data.type], {
                'notification--small': (data.size === 'small'),
            })}
        >
            <div className='notification__icon-background'>
                <IconTypes type={data.type} class_suffix='is-background' />
            </div>
            <div className='notification__icon'>
                <IconTypes type={data.type} />
            </div>
            <div className='notification__text-container'>
                <h4 className='notification__header'>
                    {data.header}
                </h4>
                <p className='notification__text-body'>
                    {data.message}
                </p>
            </div>
            { data.should_hide_close_btn ?
                undefined
                :
                <CloseButton
                    className='notification__close-button'
                    onClick={onClick}
                />
            }
            {/* TODO: Re-enable once button or call to action flow is finalized */}
            {/* !!data.action &&
                <Button
                    className={classNames('btn--secondary--default', 'notification__cta-button')}
                    onClick={data.action.onClick}
                    text={data.action.text}
                />
            */}
        </div>
    );
};

Notification.propTypes = {
    data: PropTypes.shape({
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
