import PropTypes   from 'prop-types';
import React       from 'react';
import classNames  from 'classnames';
import Icon        from 'Assets/icon.jsx';
import CloseButton from './close-button.jsx';
import {
    default_delay,
    types }        from './constants';

const Notification = ({
    data,
    removeNotification,
}) => {
    const destroy = (is_closed_by_user) => {
        removeNotification(data);

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
            <div className='notification__icon'>
                { data.type === 'danger'  && <Icon icon='IconDanger' className='notification__icon-type' /> }
                { (data.type === 'info' || data.type === 'contract_sold')
                    && <Icon icon='IconInformation' className='notification__icon-type' /> }
                { data.type === 'success' && <Icon icon='IconSuccess' className='notification__icon-type' /> }
                { data.type === 'warning' && <Icon icon='IconWarning' className='notification__icon-type' /> }
            </div>
            <div className='notification__text-container'>
                <h4 className='notification__header'>{data.header}</h4>
                <p className='notification__text-body'> {data.message}</p>
            </div>
            { data.should_hide_close_btn ? undefined : <CloseButton onClick={onClick} className='notification__close-button' />}
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
    removeNotification: PropTypes.func,
};

export default Notification;
