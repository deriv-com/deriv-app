import { ToastError } from '@deriv/components';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'Stores/connect';

const InfoToastMessage = ({
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

connect(({ ui }) => ({
    should_show_toast_error: ui.should_show_toast_error,
    setToastErrorVisibility: ui.setToastErrorVisibility,
    mobile_toast_error: ui.mobile_toast_error,
    mobile_toast_timeout: ui.mobile_toast_timeout,
}))(InfoToastMessage);
