import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MobileWrapper, ToastError } from '@deriv/components';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'Stores/connect';

const ToastErrorPopup = ({
    className,
    portal_id,
    should_show_toast_error,
    setToastErrorVisibility,
    mobile_toast_error,
    mobile_toast_timeout,
}) => {
    if (!document.getElementById(portal_id)) return null;
    return ReactDOM.createPortal(
        <ToastError
            className={className}
            is_open={should_show_toast_error}
            onClose={() => setToastErrorVisibility(false)}
            timeout={mobile_toast_timeout}
        >
            {mobile_toast_error}
        </ToastError>,
        document.getElementById(portal_id)
    );
};

export default connect(({ ui }) => ({
    should_show_toast_error: ui.should_show_toast_error,
    setToastErrorVisibility: ui.setToastErrorVisibility,
    mobile_toast_error: ui.mobile_toast_error,
    mobile_toast_timeout: ui.mobile_toast_timeout,
}))(ToastErrorPopup);

/**
 * Network status Toast components
 */
const NetworkStatusToastError = ({ status, portal_id, message }) => {
    if (!document.getElementById(portal_id) || !message) return null;

    const [is_open, setIsOpen] = useState(false);

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return ReactDOM.createPortal(
        <MobileWrapper>
            <ToastError
                className={classNames({
                    'dc-toast-error--blinker': status === 'blinker',
                })}
                is_open={is_open}
                timeout={0}
            >
                {message}
            </ToastError>
        </MobileWrapper>,
        document.getElementById(portal_id)
    );
};

NetworkStatusToastError.propTypes = {
    portal_id: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
};

export const NetworkStatusToastErrorPopup = connect(({ common, ui }) => ({
    is_positions_drawer_on: ui.is_positions_drawer_on,
    network_status: common.network_status,
}))(({ is_positions_drawer_on, network_status }) => (
    <NetworkStatusToastError
        portal_id={is_positions_drawer_on ? 'modal_root' : 'deriv_app'}
        message={network_status.tooltip}
        status={network_status.class}
    />
));
