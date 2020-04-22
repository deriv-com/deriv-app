import { Button, Modal } from '@deriv/components';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class MT5ServerErrorDialog extends Component {
    render() {
        const should_show_error = this.props.has_mt5_error && !this.props.is_mt5_success_dialog_enabled;
        return (
            <Modal
                title={localize('Whoops!')}
                is_open={should_show_error}
                small
                toggleModal={this.props.clearMt5Error}
                has_close_icon={false}
            >
                <Modal.Body>{localize(this.props.error_message)}</Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('OK')} onClick={this.props.clearMt5Error} primary />
                </Modal.Footer>
            </Modal>
        );
    }
}

MT5ServerErrorDialog.propTypes = {
    clearMt5Error: PropTypes.func,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    error_message: PropTypes.string,
    has_mt5_error: PropTypes.bool,
    is_mt5_success_dialog_enabled: PropTypes.bool,
};

export default connect(({ ui, modules }) => ({
    clearMt5Error: modules.mt5.clearMt5Error,
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
    error_message: modules.mt5.error_message,
    has_mt5_error: modules.mt5.has_mt5_error,
    is_mt5_success_dialog_enabled: modules.mt5.is_mt5_success_dialog_enabled,
}))(MT5ServerErrorDialog);
