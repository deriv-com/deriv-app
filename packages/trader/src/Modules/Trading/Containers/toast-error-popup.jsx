import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MobileWrapper, ToastError } from '@deriv/components';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'Stores/connect';

class ToastErrorPopup extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.state = {
            popup_root: document.getElementById('popup_root'),
        };
    }

    componentDidMount() {
        this.state.popup_root.appendChild(this.el);
    }

    componentWillUnmount() {
        this.state.popup_root.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            <ToastError
                is_open={this.props.should_show_toast_error}
                onClose={() => this.props.setToastErrorVisibility(false)}
                timeout={this.props.mobile_toast_timeout}
            >
                {this.props.mobile_toast_error}
            </ToastError>,
            this.el
        );
    }
}

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

export const NetworkStatusToastErrorPopup = connect(({ common }) => ({
    network_status: common.network_status,
}))(({ network_status }) => (
    <NetworkStatusToastError portal_id='deriv_app' message={network_status.tooltip} status={network_status.class} />
));
