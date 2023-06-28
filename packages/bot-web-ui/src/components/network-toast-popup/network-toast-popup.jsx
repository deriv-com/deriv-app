import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { MobileWrapper, Toast } from '@deriv/components';
import { connect } from 'Stores/connect';

// TODO: Need to sanitize,
// Same sort of component is being used inside DTrader,
// In Future we might move the `NetworkStatusToastError` to the core packages for resuability.

/**
 * Network status Toast components
 */
const NetworkStatusToastError = ({ status, portal_id, message }) => {
    const [is_open, setIsOpen] = React.useState(false);

    if (!document.getElementById(portal_id) || !message) return null;

    if (!is_open && status !== 'online') {
        setIsOpen(true); // open if status === 'blinker' or 'offline'
    } else if (is_open && status === 'online') {
        setTimeout(() => {
            setIsOpen(false);
        }, 1500);
    }

    return ReactDOM.createPortal(
        <MobileWrapper>
            <Toast
                className={classNames({
                    'dc-toast--blinker': status === 'blinker',
                })}
                is_open={is_open}
                timeout={0}
                type='error'
            >
                {message}
            </Toast>
        </MobileWrapper>,
        document.getElementById(portal_id)
    );
};

NetworkStatusToastError.propTypes = {
    portal_id: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
};

export default connect(({ common }) => ({
    network_status: common.network_status,
}))(({ network_status }) => (
    <NetworkStatusToastError portal_id='popup_root' message={network_status.tooltip} status={network_status.class} />
));
