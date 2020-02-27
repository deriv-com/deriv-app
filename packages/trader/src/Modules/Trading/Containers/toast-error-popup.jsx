import { ToastError } from '@deriv/components';
import React from 'react';
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
