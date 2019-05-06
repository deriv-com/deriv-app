import PropTypes        from 'prop-types';
import React            from 'react';
import classNames       from 'classnames';
import {
    Icon,
    IconError }         from 'Assets/Common';
import { IconInfoBlue } from 'Assets/Common/icon-info-blue.jsx';
import { IconWarning }  from 'Assets/Common/icon-warning.jsx';
import { IconSuccess }  from 'Assets/Common/icon-success.jsx';
import CloseButton      from './close-button.jsx';
import {
    DEFAULT_DELAY,
    POSITIONS,
    TYPES }             from './constants';

const Toast = ({
    data,
    removeToastMessage,
}) => {
    const destroy = (is_closed_by_user) => {
        removeToastMessage(data);

        if (typeof data.closeOnClick === 'function') {
            data.closeOnClick(data, is_closed_by_user);
        }
    };

    const onClick = () => destroy(true);

    if (data.is_auto_close || data.is_auto_close === undefined) {
        setTimeout(destroy, data.delay || DEFAULT_DELAY);
    }

    return (
        <div
            className={classNames('toast__body', POSITIONS.TOP_RIGHT, data.position, TYPES[data.type.toUpperCase()])}
            onClick={onClick}
        >
            <div className='toast__body__icon'>
                { data.type === 'ERROR'   && <Icon icon={IconError} className='toast__icon-type' /> }
                { data.type === 'INFO'    && <Icon icon={IconInfoBlue} className='toast__icon-type' /> }
                { data.type === 'SUCCESS' && <Icon icon={IconSuccess} className='toast__icon-type' /> }
                { data.type === 'WARNING' && <Icon icon={IconWarning} className='toast__icon-type' /> }
            </div>
            <div className='toast__message'>
                {data.message}
            </div>
            <CloseButton onClick={onClick} />
        </div>
    );
};

Toast.propTypes = {
    data: PropTypes.shape({
        closeOnClick : PropTypes.func,
        delay        : PropTypes.number,
        is_auto_close: PropTypes.bool,
        message      : PropTypes.node,
        position     : PropTypes.string,
        type         : PropTypes.string,
    }),
    removeToastMessage: PropTypes.func,
};

export default Toast;

