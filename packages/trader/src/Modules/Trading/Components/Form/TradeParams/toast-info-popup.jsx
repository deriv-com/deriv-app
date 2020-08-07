import React from 'react';
import ReactDOM from 'react-dom';
import { ToastError } from '@deriv/components';
import { connect } from 'Stores/connect';

const InfoToastMessage = ({ portal_id, is_open, setToastErrorVisibility, message, timeout }) => {
    if (!document.getElementById(portal_id)) return null;
    return ReactDOM.createPortal(
        <ToastError
            className='dc-toast-info'
            is_open={is_open}
            onClose={() => setToastErrorVisibility(false)}
            timeout={timeout}
        >
            {message}
        </ToastError>,
        document.getElementById(portal_id)
    );
};

export default connect(({ ui }) => ({
    setToastErrorVisibility: ui.setToastErrorVisibility,
}))(InfoToastMessage);
